from fastapi import APIRouter

from app.core.country_registry import list_countries


router = APIRouter(tags=["countries"])


@router.get("/countries")
def countries() -> list[dict]:
    return [country.__dict__ for country in list_countries()]
