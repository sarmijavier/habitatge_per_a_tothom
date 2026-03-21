from __future__ import annotations

from typing import Any

from app.core.country_registry import detect_country_in_text, get_country, resolve_country_id
from app.schemas.chat import ChatRequest, ChatResponse, RouteDetails, SourceItem
from app.schemas.session import ResponseMode
from app.services.cta_service import build_housing_access_cta
from app.services.duckdb_service import duckdb_service
from app.services.provider_service import complete_with_fallback
from app.services.rag_service import retrieve_context
from app.services.routing_service import decide_route
from app.services.session_service import session_service
from app.services.web_search_service import search_web


def _resolve_focus_country(session_country_id: str, request_country_id: str | None, message: str) -> str:
    detected_in_message = detect_country_in_text(message)
    return (
        resolve_country_id(request_country_id)
        or detected_in_message
        or session_country_id
        or "es"
    )


def _build_system_prompt(
    *,
    profile_label: str,
    response_mode: ResponseMode,
    focus_country_label: str,
) -> str:
    mode_instructions = {
        ResponseMode.summary: "Responde con lenguaje claro, corto y útil.",
        ResponseMode.detail: "Responde con más detalle, mecanismos y comparativas clave.",
        ResponseMode.data: "Responde con foco en datos, evidencias, series y contexto cuantitativo.",
        ResponseMode.simulate: "Responde como simulador legislativo inicial: impactos, riesgos, supuestos y trade-offs.",
    }

    profile_instructions = {
        "citizen": "Adapta el tono a una persona curiosa, con explicaciones simples y ejemplos.",
        "academic": "Usa un tono analítico, con conceptos técnicos y comparativas.",
        "professional": "Usa síntesis ejecutiva, riesgos, implicaciones y recomendaciones.",
    }

    return f"""
Eres GLOBAL, un único chat inteligente de vivienda.
Conviertes leyes, anuncios o preguntas en mecanismos, variables, causalidad, contexto y posibles impactos.
Tu país foco actual es {focus_country_label}.

Perfil del usuario: {profile_label}.
{profile_instructions.get(profile_label, profile_instructions["citizen"])}
{mode_instructions[response_mode]}

Reglas:
- Nunca respondas con "no sé" o "en nuestros datos no está".
- Si falta cobertura interna, apóyate en el contexto web aportado.
- Si tampoco hay evidencia fuerte, da una respuesta útil basada en mecanismos y deja claro que la confianza es menor.
- Cuando cites casos, separa evidencia interna del MVP y evidencia web externa.
- Si hay riesgo o incertidumbre relevante, dilo de forma clara.
""".strip()


def _build_user_prompt(
    *,
    message: str,
    focus_country_label: str,
    rag_context: str,
    duckdb_context: dict[str, Any],
    web_results: list[dict[str, str]],
    history: list[dict[str, str]],
) -> str:
    history_block = "\n".join(
        f"{turn['role']}: {turn['content']}" for turn in history[-6:]
    )
    data_block = duckdb_context.get("summary", "Sin resumen de datos estructurados.")
    web_block = "\n".join(
        f"- {item['title']}: {item.get('body', '')} ({item.get('href', '')})"
        for item in web_results
    ) or "Sin resultados web."

    return f"""
Pregunta del usuario:
{message}

País foco:
{focus_country_label}

Historial reciente:
{history_block or 'Sin historial.'}

Contexto RAG interno:
{rag_context or 'Sin contexto RAG recuperado.'}

Contexto estructurado:
{data_block}

Contexto web externo:
{web_block}

Devuelve una respuesta lista para UI. Prioriza claridad, estructura y utilidad.
""".strip()


def _summarize_structured_context(country_id: str) -> dict[str, Any]:
    profile = duckdb_service.get_country_profile(country_id)
    policy_events = duckdb_service.get_policy_events(country_id)
    causal_rows = duckdb_service.get_causal_rows(country_id)
    chart = duckdb_service.get_chart(country_id)

    summary_parts: list[str] = []
    if profile:
        summary_parts.append(
            "Perfil de vivienda: "
            f"modelo={profile.get('housing_model') or profile.get('supply_model')}, "
            f"fortaleza={profile.get('principal_strength') or profile.get('observed_strength')}, "
            f"riesgo={profile.get('principal_risk') or profile.get('observed_risk')}."
        )
    if policy_events:
        formatted_events = ", ".join(
            f"{item.get('event_date')} {item.get('policy_topic')}" for item in policy_events[:4]
        )
        summary_parts.append(f"Eventos normativos recientes: {formatted_events}.")
    if causal_rows:
        first_row = causal_rows[0]
        summary_parts.append(
            "Cadena causal destacada: "
            f"{first_row.get('policy_shock') or first_row.get('policy_or_regime')} -> "
            f"{first_row.get('market_transmission')} -> "
            f"{first_row.get('expected_result') or first_row.get('observed_or_expected_result')}."
        )

    return {
        "summary": "\n".join(summary_parts) if summary_parts else "Sin resumen estructurado disponible.",
        "chart": chart,
    }


def _merge_sources(
    rag_sources: list[dict[str, str]],
    web_sources: list[dict[str, str]],
) -> list[SourceItem]:
    items: list[SourceItem] = []
    for source in rag_sources:
        items.append(
            SourceItem(
                type="rag",
                title=source.get("title", "Fuente RAG"),
                path=source.get("path"),
                country=source.get("country"),
            )
        )
    for source in web_sources:
        items.append(
            SourceItem(
                type="web",
                title=source.get("title", "Fuente web"),
                href=source.get("href"),
            )
        )
    return items


def answer_chat(request: ChatRequest) -> ChatResponse:
    session = session_service.get(request.session_id)
    response_mode = request.response_mode or session.response_mode
    session_service.set_response_mode(request.session_id, response_mode)

    requested_core_country_id = resolve_country_id(request.focus_country_id)
    external_focus_country_label = (
        request.focus_country_label.strip()
        if request.focus_country_label and not requested_core_country_id
        else None
    )

    focus_country_id = _resolve_focus_country(
        session_country_id=session.focus_country_id,
        request_country_id=request.focus_country_id,
        message=request.message,
    )
    session_service.set_focus_country(request.session_id, focus_country_id)
    focus_country = get_country(focus_country_id)
    focus_country_label = (
        external_focus_country_label
        or (focus_country.label if focus_country else request.focus_country_id)
        or "País externo"
    )

    route = decide_route(
        message=request.message,
        profile=session.profile,
        response_mode=response_mode,
    )

    rag_focus_country = None if external_focus_country_label else focus_country_id
    rag_bundle = retrieve_context(request.message, focus_country_id=rag_focus_country)
    structured_bundle = (
        {"summary": "Sin contexto estructurado interno para este país externo.", "chart": None}
        if external_focus_country_label
        else _summarize_structured_context(focus_country_id)
    )
    should_search_web = request.include_web_fallback and (
        bool(external_focus_country_label)
        or not rag_bundle["sources"]
        or focus_country is None
        or focus_country_id not in {"es", "sg", "cu", "ve"}
    )
    web_results = search_web(f"{request.message} {focus_country_label} housing law") if should_search_web else []

    system_prompt = _build_system_prompt(
        profile_label=session.profile.value,
        response_mode=response_mode,
        focus_country_label=focus_country_label,
    )
    user_prompt = _build_user_prompt(
        message=request.message,
        focus_country_label=focus_country_label,
        rag_context=rag_bundle["context"],
        duckdb_context=structured_bundle,
        web_results=web_results,
        history=session_service.get_history(request.session_id),
    )
    provider_result = complete_with_fallback(
        preferred_provider=route.preferred_provider,
        fallback_chain=route.fallback_chain,
        system_prompt=system_prompt,
        user_prompt=user_prompt,
    )

    cta = build_housing_access_cta(profile=session.profile, message=request.message)
    session_service.append_turn(request.session_id, request.message, provider_result.content)

    return ChatResponse(
        session_id=request.session_id,
        answer=provider_result.content,
        response_mode=response_mode,
        provider_used=provider_result.provider,
        focus_country_id=focus_country_id,
        sources=_merge_sources(rag_bundle["sources"], web_results),
        route=RouteDetails(
            intent=route.intent,
            preferred_provider=route.preferred_provider,
            attempted_providers=provider_result.attempted,
            fallback_chain=route.fallback_chain,
            used_rag=bool(rag_bundle["sources"]),
            used_duckdb=bool(structured_bundle["summary"]),
            used_web=bool(web_results),
            focus_country_id=focus_country_id,
        ),
        cta=cta,
        chart=structured_bundle["chart"] if response_mode in {ResponseMode.data, ResponseMode.simulate} else None,
        diagnostics={
            "route_reason": route.reason,
            "rag_sources": len(rag_bundle["sources"]),
            "web_sources": len(web_results),
        },
    )
