from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.provider_service import complete_with_fallback

router = APIRouter(tags=["debate"])

class DebateRequest(BaseModel):
    topic: str
    context: str = ""

class DebateResponse(BaseModel):
    topic: str
    defensor: str
    critico: str
    veredicto: str

@router.post("/debate", response_model=DebateResponse)
def debate(payload: DebateRequest) -> DebateResponse:
    try:
        topic = payload.topic
        context = payload.context

        # IA Defensora
        defensor_result = complete_with_fallback(
            preferred_provider="groq",
            fallback_chain=["mistral", "gemini"],
            system_prompt="Eres un defensor experto en políticas de vivienda. Argumenta A FAVOR de la medida propuesta con datos reales y casos históricos. Sé directo y convincente. Máximo 200 palabras.",
            user_prompt=f"Medida: {topic}\nContexto adicional: {context}\n\nDefiende esta medida con argumentos sólidos basados en evidencia.",
        )

        # IA Crítica
        critico_result = complete_with_fallback(
            preferred_provider="mistral",
            fallback_chain=["groq", "gemini"],
            system_prompt="Eres un crítico experto en políticas de vivienda. Argumenta EN CONTRA de la medida propuesta con datos reales y casos históricos donde falló. Sé directo y convincente. Máximo 200 palabras.",
            user_prompt=f"Medida: {topic}\nContexto adicional: {context}\n\nCritica esta medida con argumentos sólidos basados en evidencia.",
        )

        # IA Árbitro
        veredicto_result = complete_with_fallback(
            preferred_provider="gemini",
            fallback_chain=["mistral", "groq"],
            system_prompt="Eres un árbitro experto e imparcial en políticas de vivienda. Basándote en los argumentos presentados y en evidencia histórica real, da un veredicto equilibrado. Indica qué condiciones harían funcionar o fallar esta medida. Máximo 150 palabras.",
            user_prompt=f"Medida debatida: {topic}\n\nArgumento a favor:\n{defensor_result.content}\n\nArgumento en contra:\n{critico_result.content}\n\nDa tu veredicto imparcial basado en evidencia.",
        )

        return DebateResponse(
            topic=topic,
            defensor=defensor_result.content,
            critico=critico_result.content,
            veredicto=veredicto_result.content,
        )

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc