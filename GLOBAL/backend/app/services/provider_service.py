from __future__ import annotations

import os
from dataclasses import dataclass

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from openai import OpenAI

from app.config import DEMO_MODE, GEMINI_CHAT_MODEL, GROQ_MODEL, MISTRAL_MODEL


class ProviderError(RuntimeError):
    pass


@dataclass
class ProviderResult:
    provider: str
    content: str
    attempted: list[str]


def _resolve_mistral_endpoint() -> tuple[str, str]:
    env_base_url = os.getenv("GLOBAL_MISTRAL_BASE_URL")
    env_model = os.getenv("GLOBAL_MISTRAL_MODEL")
    return (
        env_base_url or "https://api.mistral.ai/v1",
        env_model or MISTRAL_MODEL,
    )


def _mock_answer(provider: str, prompt: str) -> str:
    return (
        f"[MODO DEMO:{provider}] Respuesta simulada.\n\n"
        f"Resumen operativo del contexto recibido:\n{prompt[:1200]}"
    )


def _call_gemini(system_prompt: str, user_prompt: str) -> str:
    if DEMO_MODE:
        return _mock_answer("gemini", user_prompt)
    if not (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")):
        raise ProviderError("Gemini no está configurado.")
    llm = ChatGoogleGenerativeAI(model=GEMINI_CHAT_MODEL, temperature=0.2)
    response = llm.invoke(
        [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
    )
    return str(response.content)


def _call_openai_compatible(
    *,
    provider: str,
    base_url: str,
    api_key_env: str,
    model: str,
    system_prompt: str,
    user_prompt: str,
) -> str:
    if DEMO_MODE:
        return _mock_answer(provider, user_prompt)
    api_key = os.getenv(api_key_env)
    if not api_key:
        raise ProviderError(f"{provider} no está configurado.")
    client = OpenAI(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return response.choices[0].message.content or ""


def _call_provider(provider: str, system_prompt: str, user_prompt: str) -> str:
    if provider == "gemini":
        return _call_gemini(system_prompt, user_prompt)
    if provider == "groq":
        return _call_openai_compatible(
            provider="groq",
            base_url=os.getenv("GLOBAL_GROQ_BASE_URL", "https://api.groq.com/openai/v1"),
            api_key_env="GROQ_API_KEY",
            model=GROQ_MODEL,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )
    if provider == "mistral":
        mistral_base_url, mistral_model = _resolve_mistral_endpoint()
        return _call_openai_compatible(
            provider="mistral",
            base_url=mistral_base_url,
            api_key_env="MISTRAL_API_KEY",
            model=mistral_model,
            system_prompt=system_prompt,
            user_prompt=user_prompt,
        )
    raise ProviderError(f"Proveedor desconocido: {provider}")


def complete_with_fallback(
    *,
    preferred_provider: str,
    fallback_chain: list[str],
    system_prompt: str,
    user_prompt: str,
) -> ProviderResult:
    attempted: list[str] = []
    for provider in [preferred_provider, *fallback_chain]:
        attempted.append(provider)
        try:
            content = _call_provider(provider, system_prompt, user_prompt)
            return ProviderResult(provider=provider, content=content, attempted=attempted)
        except Exception:
            continue
    raise ProviderError("No hay ningún proveedor disponible para responder la consulta.")
