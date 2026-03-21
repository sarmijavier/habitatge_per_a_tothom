from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from app.schemas.session import ResponseMode


class ChatRequest(BaseModel):
    session_id: str
    message: str
    response_mode: ResponseMode | None = None
    focus_country_id: str | None = None
    focus_country_label: str | None = None
    include_web_fallback: bool = True


class SourceItem(BaseModel):
    type: str
    title: str
    href: str | None = None
    path: str | None = None
    country: str | None = None


class ChartPoint(BaseModel):
    x: str
    y: float | None = None


class ChartSeries(BaseModel):
    label: str
    points: list[ChartPoint] = Field(default_factory=list)


class ChartPayload(BaseModel):
    title: str
    subtitle: str | None = None
    x_label: str = "Periodo"
    y_label: str = "Valor"
    series: list[ChartSeries] = Field(default_factory=list)


class CallToAction(BaseModel):
    title: str
    description: str
    action_label: str
    next_step: str


class RouteDetails(BaseModel):
    intent: str
    preferred_provider: str
    attempted_providers: list[str] = Field(default_factory=list)
    fallback_chain: list[str] = Field(default_factory=list)
    used_rag: bool = False
    used_duckdb: bool = False
    used_web: bool = False
    focus_country_id: str | None = None


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    response_mode: ResponseMode
    provider_used: str
    focus_country_id: str | None = None
    sources: list[SourceItem] = Field(default_factory=list)
    route: RouteDetails
    cta: CallToAction | None = None
    chart: ChartPayload | None = None
    diagnostics: dict[str, Any] = Field(default_factory=dict)
