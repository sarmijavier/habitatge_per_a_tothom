from __future__ import annotations

from dataclasses import dataclass

from app.schemas.session import OnboardingProfile, ResponseMode


@dataclass(frozen=True)
class RouteDecision:
    intent: str
    preferred_provider: str
    fallback_chain: list[str]
    reason: str


BRIEF_KEYWORDS = {
    "que es",
    "qué es",
    "resumen",
    "faq",
    "clasifica",
    "reformula",
    "explicalo",
    "explícalo",
}

DATA_KEYWORDS = {
    "ver datos",
    "grafica",
    "gráfica",
    "simular",
    "impacto",
    "comparativa",
    "causal",
    "escenario",
}

HOUSING_COMPLEXITY_KEYWORDS = {
    "alquiler",
    "compra",
    "hipoteca",
    "vivienda",
    "contrato",
    "ayuda",
    "desahucio",
    "ley",
    "mercado",
}


def decide_route(
    *,
    message: str,
    profile: OnboardingProfile,
    response_mode: ResponseMode,
) -> RouteDecision:
    lowered = message.lower()
    word_count = len(message.split())

    if response_mode in {ResponseMode.data, ResponseMode.simulate} or any(
        keyword in lowered for keyword in DATA_KEYWORDS
    ):
        return RouteDecision(
            intent="analysis",
            preferred_provider="mistral",
            fallback_chain=["gemini", "groq"],
            reason="Consulta orientada a datos, simulación o causalidad.",
        )

    if word_count <= 20 or any(keyword in lowered for keyword in BRIEF_KEYWORDS):
        return RouteDecision(
            intent="faq",
            preferred_provider="groq",
            fallback_chain=["gemini", "mistral"],
            reason="Pregunta breve o de clasificación.",
        )

    if any(keyword in lowered for keyword in HOUSING_COMPLEXITY_KEYWORDS):
        preferred_provider = (
            "mistral" if profile == OnboardingProfile.professional else "gemini"
        )
        fallback_chain = (
            ["gemini", "groq"]
            if preferred_provider == "mistral"
            else ["mistral", "groq"]
        )
        return RouteDecision(
            intent="housing_context",
            preferred_provider=preferred_provider,
            fallback_chain=fallback_chain,
            reason="Consulta compleja de vivienda, ayudas, contratos o contexto largo.",
        )

    if profile == OnboardingProfile.professional:
        return RouteDecision(
            intent="strategic",
            preferred_provider="mistral",
            fallback_chain=["gemini", "groq"],
            reason="Perfil profesional con foco ejecutivo y análisis denso.",
        )

    return RouteDecision(
        intent="general",
        preferred_provider="gemini",
        fallback_chain=["mistral", "groq"],
        reason="Ruta general por defecto.",
    )
