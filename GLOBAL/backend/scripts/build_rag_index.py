from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.config import (  # noqa: E402
    EMBEDDING_BATCH_SIZE,
    EMBEDDING_RETRY_SECONDS,
    INCLUDE_CATEGORIES,
    INCLUDE_COUNTRIES,
    MAX_CHUNKS,
    MAX_DOCUMENTS,
)
from app.services.rag_service import build_vectorstore  # noqa: E402


def main() -> None:
    _, doc_count, chunk_count = build_vectorstore(recreate=True)
    print(f"Categorias indexadas: {', '.join(INCLUDE_CATEGORIES) if INCLUDE_CATEGORIES else 'todas'}")
    print(f"Paises indexados: {', '.join(INCLUDE_COUNTRIES) if INCLUDE_COUNTRIES else 'todos'}")
    print(f"Batch embeddings: {EMBEDDING_BATCH_SIZE}")
    print(f"Espera por cuota: {EMBEDDING_RETRY_SECONDS}s")
    print(f"Max documentos: {MAX_DOCUMENTS or 'sin limite'}")
    print(f"Max chunks: {MAX_CHUNKS or 'sin limite'}")
    print("Indice RAG construido.")
    print(f"Documentos indexados: {doc_count}")
    print(f"Chunks indexados: {chunk_count}")


if __name__ == "__main__":
    main()
