from __future__ import annotations

import re
from pathlib import Path

import duckdb

from app.config import DATA_ROOT, DUCKDB_PATH
from app.core.country_registry import get_country
from app.schemas.chat import ChartPayload, ChartPoint, ChartSeries


CORE_TABLES = {
    "mvp_es_sg_cu_housing_system_profiles": DATA_ROOT
    / "derived"
    / "policy"
    / "mvp_es_sg_cu_housing_system_profiles.csv",
    "ve_extreme_housing_system_profile": DATA_ROOT
    / "derived"
    / "policy"
    / "ve_extreme_housing_system_profile.csv",
    "mvp_es_sg_cu_policy_events": DATA_ROOT
    / "derived"
    / "policy"
    / "mvp_es_sg_cu_policy_events.csv",
    "mvp_es_sg_cu_causal_chains_curated": DATA_ROOT
    / "derived"
    / "policy"
    / "mvp_es_sg_cu_causal_chains_curated.csv",
    "ve_extreme_causal_chains_curated": DATA_ROOT
    / "derived"
    / "policy"
    / "ve_extreme_causal_chains_curated.csv",
    "wb_es_sg_cu_context_panel_2010_2025": DATA_ROOT
    / "metadata"
    / "global"
    / "worldbank"
    / "wb_es_sg_cu_context_panel_2010_2025.csv",
    "wb_ve_context_panel_1990_2025": DATA_ROOT
    / "metadata"
    / "extremes"
    / "wb_ve_context_panel_1990_2025.csv",
}


def _sanitize_identifier(name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_]+", "_", name).strip("_").lower()


class DuckDBService:
    def __init__(self, db_path: Path = DUCKDB_PATH) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)

    def connect(self) -> duckdb.DuckDBPyConnection:
        return duckdb.connect(str(self.db_path))

    def ensure_bootstrapped(self) -> None:
        with self.connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS dataset_catalog (
                    table_name VARCHAR,
                    source_path VARCHAR,
                    country_hint VARCHAR
                )
                """
            )

            for table_name, source_path in CORE_TABLES.items():
                if not source_path.exists():
                    continue

                connection.execute(f"DROP TABLE IF EXISTS {table_name}")
                connection.execute(
                    f"""
                    CREATE TABLE {table_name} AS
                    SELECT *
                    FROM read_csv_auto(?, header=true, all_varchar=true, sample_size=-1)
                    """,
                    [str(source_path)],
                )
                connection.execute(
                    "DELETE FROM dataset_catalog WHERE table_name = ?",
                    [table_name],
                )
                country_hint = source_path.name[:2]
                connection.execute(
                    """
                    INSERT INTO dataset_catalog (table_name, source_path, country_hint)
                    VALUES (?, ?, ?)
                    """,
                    [table_name, str(source_path), country_hint],
                )

    def get_country_profile(self, country_id: str) -> dict | None:
        self.ensure_bootstrapped()
        table_name = (
            "mvp_es_sg_cu_housing_system_profiles"
            if country_id in {"es", "sg", "cu"}
            else "ve_extreme_housing_system_profile"
        )
        query = f"SELECT * FROM {table_name} WHERE lower(country_code) = ? OR lower(case_id) = ? LIMIT 1"
        try:
            with self.connect() as connection:
                row = connection.execute(query, [country_id.lower(), country_id.lower()]).fetchone()
                if row is None:
                    return None
                columns = [item[0] for item in connection.description]
                return dict(zip(columns, row))
        except duckdb.Error:
            return None

    def get_policy_events(self, country_id: str) -> list[dict]:
        self.ensure_bootstrapped()
        if country_id not in {"es", "sg", "cu"}:
            return []
        with self.connect() as connection:
            rows = connection.execute(
                """
                SELECT country_code, country, event_date, instrument_type, policy_topic, source_file
                FROM mvp_es_sg_cu_policy_events
                WHERE lower(country_code) = ?
                ORDER BY event_date DESC
                LIMIT 6
                """,
                [country_id.lower()],
            ).fetchall()
            columns = [item[0] for item in connection.description]
            return [dict(zip(columns, row)) for row in rows]

    def get_causal_rows(self, country_id: str) -> list[dict]:
        self.ensure_bootstrapped()
        table_name = (
            "mvp_es_sg_cu_causal_chains_curated"
            if country_id in {"es", "sg", "cu"}
            else "ve_extreme_causal_chains_curated"
        )
        field_name = "country_code" if country_id in {"es", "sg", "cu"} else "case_id"
        with self.connect() as connection:
            rows = connection.execute(
                f"""
                SELECT *
                FROM {table_name}
                WHERE lower({field_name}) = ?
                LIMIT 5
                """,
                [country_id.lower()],
            ).fetchall()
            columns = [item[0] for item in connection.description]
            return [dict(zip(columns, row)) for row in rows]

    def get_chart(self, country_id: str) -> ChartPayload | None:
        self.ensure_bootstrapped()
        country = get_country(country_id)
        if country is None:
            return None

        table_name = (
            "wb_es_sg_cu_context_panel_2010_2025"
            if country_id in {"es", "sg", "cu"}
            else "wb_ve_context_panel_1990_2025"
        )
        country_code = {"es": "ESP", "sg": "SGP", "cu": "CUB", "ve": "VEN"}[country_id]

        with self.connect() as connection:
            rows = connection.execute(
                f"""
                SELECT year, unemployment_rate, gdp_per_capita_current_usd
                FROM {table_name}
                WHERE country_code = ?
                ORDER BY TRY_CAST(year AS INTEGER) DESC
                LIMIT 8
                """,
                [country_code],
            ).fetchall()
            if not rows:
                return None

        cleaned_rows = list(reversed(rows))

        def to_number(raw_value: str | None) -> float | None:
            if raw_value in {None, ""}:
                return None
            try:
                return float(str(raw_value).replace(".", "").replace(",", "."))
            except ValueError:
                return None

        unemployment_points = [
            ChartPoint(x=str(year), y=to_number(unemployment))
            for year, unemployment, _gdp in cleaned_rows
        ]
        gdp_points = [
            ChartPoint(x=str(year), y=to_number(gdp))
            for year, _unemployment, gdp in cleaned_rows
        ]

        return ChartPayload(
            title=f"Contexto reciente de {country.label}",
            subtitle="Serie corta con desempleo y PIB per cápita a modo de apoyo contextual.",
            x_label="Año",
            y_label="Valor",
            series=[
                ChartSeries(label="Desempleo", points=unemployment_points),
                ChartSeries(label="PIB per cápita (USD)", points=gdp_points),
            ],
        )


duckdb_service = DuckDBService()
