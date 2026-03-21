from fastapi import APIRouter

from app.config import API_TITLE, API_VERSION


router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": API_TITLE,
        "version": API_VERSION,
    }
