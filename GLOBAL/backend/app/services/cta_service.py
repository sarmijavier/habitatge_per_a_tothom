from __future__ import annotations

from app.schemas.chat import CallToAction
from app.schemas.session import OnboardingProfile


HOUSING_ACCESS_KEYWORDS = {
    "comprar",
    "compra",
    "alquiler",
    "alquilar",
    "hipoteca",
    "ayuda",
    "precio",
    "región",
    "region",
    "vivienda",
}


def build_housing_access_cta(
    *,
    profile: OnboardingProfile,
    message: str,
) -> CallToAction | None:
    if profile != OnboardingProfile.citizen:
        return None

    lowered = message.lower()
    if not any(keyword in lowered for keyword in HOUSING_ACCESS_KEYWORDS):
        return None

    return CallToAction(
        title="Vivienda Clara",
        description=(
            "Asistente guiado para aterrizar tu situación, entender tu urgencia y ver "
            "las vías de acceso a vivienda más realistas."
        ),
        action_label="Abrir asistente de acceso a vivienda",
        next_step=(
            "Revisa tu nivel de urgencia, documentos clave, ayudas potenciales y próximos pasos."
        ),
    )
