from __future__ import annotations

import json
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.rag_service import retrieve_context  # noqa: E402


def main() -> None:
    question = " ".join(sys.argv[1:]).strip()
    if not question:
        question = input("Pregunta para GLOBAL RAG: ").strip()

    result = retrieve_context(question)
    print("\nContexto recuperado:\n")
    print(result["context"][:2500])
    print("\nFuentes:\n")
    print(json.dumps(result["sources"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
