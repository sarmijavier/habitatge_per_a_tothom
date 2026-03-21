from fastapi import APIRouter, HTTPException

from app.schemas.session import SessionCreateRequest, SessionState
from app.services.session_service import session_service


router = APIRouter(tags=["session"])


@router.post("/session/start", response_model=SessionState)
def start_session(payload: SessionCreateRequest) -> SessionState:
    return session_service.create(payload)


@router.get("/session/{session_id}", response_model=SessionState)
def get_session(session_id: str) -> SessionState:
    try:
        return session_service.get(session_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
