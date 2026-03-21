---
id: "derived-policy-extreme-cases-source-map-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "extreme cases fuentes map"
ruta_origen: "derived/policy/extreme_cases_source_map.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# extreme cases fuentes map

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/extreme_cases_source_map.csv

## Estructura

- Filas: 4
- Columnas: case_id, country, structured_metadata_source, macro_context_source, housing_report_source_1, housing_report_source_2, housing_report_source_3, recommended_use

## Tabla derivada

| case_id | country | structured_metadata_source | macro_context_source | housing_report_source_1 | housing_report_source_2 | housing_report_source_3 | recommended_use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ddr | German Democratic Republic | metadata/extremes/ddr/ddr_1971_ipums_metadata.json |  | rag/reports/extremes/ddr/ddr_destatis_wirtschaft_und_statistik_1990_11.pdf | rag/reports/extremes/ddr/ddr_destatis_wirtschaft_und_statistik_1992_02.pdf | rag/reports/extremes/ddr/ddr_bpb_history_overview.pdf | historical_comparison_of_admin_allocation_shortage_and_transition |
| ussr | Soviet Union |  |  | rag/reports/extremes/ussr/ussr_housing_system_and_its_reform_worldbank_1990.pdf | rag/reports/extremes/ussr/russia_housing_sector_transition_worldbank_1998.pdf |  | historical_comparison_of_socialized_housing_and_queue_systems |
| cn | China | metadata/extremes/cn/cn_2000_ipums_metadata.json | metadata/extremes/wb_extremes_cn_ve_context_panel_1990_2025.csv | rag/reports/extremes/cn/cn_worldbank_urban_housing_reform_policy_note.pdf | rag/reports/extremes/cn/cn_worldbank_housing_finance_2025.pdf |  | comparison_of_transition_from_public_allocation_to_mixed_market |
| ve | Venezuela | metadata/extremes/ve/ve_2001_ipums_metadata.json; metadata/extremes/ve/ve_2022_abandoned_houses_refugees_survey_metadata... | metadata/extremes/wb_extremes_cn_ve_context_panel_1990_2025.csv | rag/reports/extremes/ve/ve_worldbank_urbanization_and_housing_investment.pdf |  |  | comparison_of_controls_macro_instability_informality_and_property_insecurity |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.