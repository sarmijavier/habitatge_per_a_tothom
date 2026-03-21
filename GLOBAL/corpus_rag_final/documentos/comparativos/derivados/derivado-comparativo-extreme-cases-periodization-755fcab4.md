---
id: "derived-policy-extreme-cases-periodization-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "extreme cases periodization"
ruta_origen: "derived/policy/extreme_cases_periodization.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# extreme cases periodization

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/extreme_cases_periodization.csv

## Estructura

- Filas: 5
- Columnas: case_id, country, period_label, period_start, period_end, property_regime_label, market_coordination_level, comparability_to_hypothetical_spain, main_reason_to_include, main_caution, primary_sources, __EMPTY

## Tabla derivada

| case_id | country | period_label | period_start | period_end | property_regime_label | market_coordination_level | comparability_to_hypothetical_spain | main_reason_to_include | main_caution | primary_sources | __EMPTY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ddr | German Democratic Republic | state_socialist_housing_system | 1949 | 1990 | state_dominant_and_administratively_allocated | low | medium | European historical case of state-led housing allocation and chronic shortage | Historical and reunification context differs from modern Spain | metadata/extremes/ddr/ddr_1971_ipums_metadata.json; rag/reports/extremes/ddr/ddr_destatis_wirtschaft_und_statistik_1990_... |  |
| ussr | Soviet Union | late_soviet_housing_system | 1960 | 1991 | state_socialized_and_queue_based | low | medium | Canonical case of strong administrative allocation and long waiting lists | Very different political and production system from EU democracies | rag/reports/extremes/ussr/ussr_housing_system_and_its_reform_worldbank_1990.pdf; rag/reports/extremes/ussr/russia_housin... |  |
| cn | China | maoist_and_pre_reform_period | 1949 | 1978 | public_allocation_and_work_unit_housing | low | low_to_medium | Illustrates housing under public allocation before market reform | Not comparable to post-reform China and not directly comparable to current Spain | rag/reports/extremes/cn/cn_worldbank_urban_housing_reform_policy_note.pdf |  |
| cn | China | post_reform_mixed_housing_system | 1978 | 2025 | mixed_market_with_strong_state_direction | medium_to_high | medium | Shows transition from public allocation to mixed ownership and marketization | Current China is not a no-private-property case | rag/reports/extremes/cn/cn_worldbank_housing_finance_2025.pdf; metadata/extremes/cn/cn_2000_ipums_metadata.json; metadat... |  |
| ve | Venezuela | interventionist_mixed_housing_system | 1999 | 2025 | mixed_property_with_controls_and_selective_expropriation | medium | low_to_medium | Useful for studying price controls | expropriation risk and informality under stress | Venezuela did not fully abolish private residential property | rag/reports/extremes/ve/ve_worldbank_urbanization_and_housing_investment.pdf; metadata/extremes/ve/ve_2001_ipums_metadat... |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.