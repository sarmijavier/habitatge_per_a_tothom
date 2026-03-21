from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class OnboardingProfile(str, Enum):
    citizen = "citizen"
    academic = "academic"
    professional = "professional"


class ResponseMode(str, Enum):
    summary = "summary"
    detail = "detail"
    data = "data"
    simulate = "simulate"


class SessionCreateRequest(BaseModel):
    profile: OnboardingProfile = OnboardingProfile.citizen
    focus_country_id: str = Field(default="es")
    language: str = Field(default="es")
    wants_housing_access_help: bool = False


class SessionState(BaseModel):
    session_id: str
    profile: OnboardingProfile
    focus_country_id: str
    language: str = "es"
    wants_housing_access_help: bool = False
    response_mode: ResponseMode = ResponseMode.summary
    preferences: dict[str, Any] = Field(default_factory=dict)
    message_count: int = 0
