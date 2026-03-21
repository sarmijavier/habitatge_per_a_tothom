from __future__ import annotations

from pathlib import Path
import os

import uvicorn


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    reload_enabled = os.getenv("GLOBAL_API_RELOAD", "false").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        app_dir=str(backend_root),
        reload=reload_enabled,
        reload_dirs=[str(backend_root)] if reload_enabled else None,
    )


if __name__ == "__main__":
    main()
