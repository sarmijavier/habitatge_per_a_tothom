from __future__ import annotations

import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.services.duckdb_service import duckdb_service  # noqa: E402


def main() -> None:
    duckdb_service.ensure_bootstrapped()
    print("DuckDB preparado en backend/data/global.duckdb")


if __name__ == "__main__":
    main()
