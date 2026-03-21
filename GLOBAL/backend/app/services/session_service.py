from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.core.country_registry import resolve_country_id
from app.schemas.session import ResponseMode, SessionCreateRequest, SessionState


class SessionService:
    def __init__(self) -> None:
        self._sessions: dict[str, dict] = {}

    def create(self, payload: SessionCreateRequest) -> SessionState:
        session_id = uuid4().hex
        focus_country_id = resolve_country_id(payload.focus_country_id, default="es") or "es"
        self._sessions[session_id] = {
            "state": SessionState(
                session_id=session_id,
                profile=payload.profile,
                focus_country_id=focus_country_id,
                language=payload.language,
                wants_housing_access_help=payload.wants_housing_access_help,
            ),
            "history": [],
            "created_at": datetime.now(timezone.utc),
        }
        return self._sessions[session_id]["state"]

    def get(self, session_id: str) -> SessionState:
        if session_id not in self._sessions:
            raise KeyError(f"Sesion no encontrada: {session_id}")
        return self._sessions[session_id]["state"]

    def set_response_mode(self, session_id: str, response_mode: ResponseMode) -> SessionState:
        state = self.get(session_id)
        state.response_mode = response_mode
        return state

    def set_focus_country(self, session_id: str, focus_country_id: str | None) -> SessionState:
        state = self.get(session_id)
        state.focus_country_id = resolve_country_id(focus_country_id, default=state.focus_country_id) or state.focus_country_id
        return state

    def append_turn(self, session_id: str, user_message: str, assistant_message: str) -> None:
        state = self.get(session_id)
        state.message_count += 1
        self._sessions[session_id]["history"].append(
            {"role": "user", "content": user_message}
        )
        self._sessions[session_id]["history"].append(
            {"role": "assistant", "content": assistant_message}
        )

    def get_history(self, session_id: str, limit: int = 10) -> list[dict[str, str]]:
        if session_id not in self._sessions:
            return []
        history = self._sessions[session_id]["history"]
        return history[-limit:]


session_service = SessionService()
