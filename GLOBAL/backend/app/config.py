from __future__ import annotations

import os
from pathlib import Path


def _env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _env_csv(name: str, default: str = "") -> tuple[str, ...]:
    raw = os.getenv(name, default).strip()
    if not raw:
        return ()
    return tuple(item.strip() for item in raw.split(",") if item.strip())


PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = PROJECT_ROOT / "backend"
DATA_ROOT = PROJECT_ROOT / "datos_crudos_finales"
CORPUS_ROOT = Path(
    os.getenv(
        "GLOBAL_CORPUS_ROOT",
        str(PROJECT_ROOT / "corpus_rag_final" / "documentos"),
    )
)
VECTORSTORE_DIR = Path(
    os.getenv(
        "GLOBAL_VECTORSTORE_DIR",
        str(BACKEND_ROOT / "data" / "chroma_rag"),
    )
)
DUCKDB_PATH = Path(
    os.getenv(
        "GLOBAL_DUCKDB_PATH",
        str(BACKEND_ROOT / "data" / "global.duckdb"),
    )
)

API_TITLE = "GLOBAL Prototype API"
API_VERSION = "0.1.0"

ALLOWED_ORIGINS = _env_csv(
    "GLOBAL_ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

CHROMA_COLLECTION = os.getenv("GLOBAL_CHROMA_COLLECTION", "global_markdown_rag")
RETRIEVER_K = int(os.getenv("GLOBAL_RETRIEVER_K", "6"))
INDEX_DATASET_CARDS = _env_flag("GLOBAL_INDEX_DATASET_CARDS", default=False)
INCLUDE_CATEGORIES = tuple(
    item.lower() for item in _env_csv("GLOBAL_INCLUDE_CATEGORIES", "leyes,derivados")
)
INCLUDE_COUNTRIES = tuple(
    item.lower()
    for item in _env_csv("GLOBAL_INCLUDE_COUNTRIES", "espana,singapur,cuba,venezuela")
)
EMBEDDING_BATCH_SIZE = int(os.getenv("GLOBAL_EMBEDDING_BATCH_SIZE", "25"))
EMBEDDING_RETRY_SECONDS = int(os.getenv("GLOBAL_EMBEDDING_RETRY_SECONDS", "65"))
MAX_DOCUMENTS = int(os.getenv("GLOBAL_MAX_DOCUMENTS", "0"))
MAX_CHUNKS = int(os.getenv("GLOBAL_MAX_CHUNKS", "0"))

GEMINI_CHAT_MODEL = os.getenv("GLOBAL_GEMINI_CHAT_MODEL", "gemini-2.5-flash")
GEMINI_EMBEDDING_MODEL = os.getenv(
    "GLOBAL_GEMINI_EMBEDDING_MODEL", "gemini-embedding-2-preview"
)
GROQ_MODEL = os.getenv("GLOBAL_GROQ_MODEL", "llama-3.1-8b-instant")
MISTRAL_MODEL = os.getenv("GLOBAL_MISTRAL_MODEL", "mistral-small-latest")
SEARCH_MAX_RESULTS = int(os.getenv("GLOBAL_SEARCH_MAX_RESULTS", "5"))
SEARCH_REGION = os.getenv("GLOBAL_SEARCH_REGION", "wt-wt")
SEARCH_SAFESEARCH = os.getenv("GLOBAL_SEARCH_SAFESEARCH", "moderate")

DEMO_MODE = _env_flag("GLOBAL_DEMO_MODE", default=False)
