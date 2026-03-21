from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CountryDefinition:
    id: str
    slug: str
    label: str
    role: str
    short_description: str
    kind: str


COUNTRIES: dict[str, CountryDefinition] = {
    "es": CountryDefinition(
        id="es",
        slug="espana",
        label="España",
        role="target",
        short_description="País objetivo del MVP.",
        kind="core",
    ),
    "sg": CountryDefinition(
        id="sg",
        slug="singapur",
        label="Singapur",
        role="success_case",
        short_description="Caso de éxito condicionado por alta capacidad estatal.",
        kind="core",
    ),
    "cu": CountryDefinition(
        id="cu",
        slug="cuba",
        label="Cuba",
        role="systemic_failure",
        short_description="Caso extremo de intervención con baja transferibilidad.",
        kind="core",
    ),
    "ve": CountryDefinition(
        id="ve",
        slug="venezuela",
        label="Venezuela",
        role="systemic_failure",
        short_description="Caso de deterioro institucional y crisis habitacional.",
        kind="core",
    ),
}

ALIASES: dict[str, str] = {
    "es": "es",
    "espana": "es",
    "españa": "es",
    "spain": "es",
    "sg": "sg",
    "singapur": "sg",
    "singapore": "sg",
    "cu": "cu",
    "cuba": "cu",
    "ve": "ve",
    "venezuela": "ve",
}


def get_country(country_id: str | None) -> CountryDefinition | None:
    if not country_id:
        return None
    return COUNTRIES.get(country_id.lower())


def resolve_country_id(raw_value: str | None, default: str | None = None) -> str | None:
    if not raw_value:
        return default
    normalized = raw_value.strip().lower()
    return ALIASES.get(normalized, default)


def detect_country_in_text(text: str) -> str | None:
    lowered = text.lower()
    for alias, country_id in ALIASES.items():
        if alias in lowered:
            return country_id
    return None


def list_countries() -> list[CountryDefinition]:
    return list(COUNTRIES.values())


def is_core_country(country_id: str | None) -> bool:
    return bool(country_id and country_id.lower() in COUNTRIES)
