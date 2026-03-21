from fastapi import APIRouter

from app.api.routes.chat import router as chat_router
from app.api.routes.countries import router as countries_router
from app.api.routes.health import router as health_router
from app.api.routes.session import router as session_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(countries_router)
api_router.include_router(session_router)
api_router.include_router(chat_router)
