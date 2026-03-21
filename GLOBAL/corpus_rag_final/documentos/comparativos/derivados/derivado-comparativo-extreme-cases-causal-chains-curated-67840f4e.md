---
id: "derived-policy-extreme-cases-causal-chains-curated-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "extreme cases causal chains curated"
ruta_origen: "derived/policy/extreme_cases_causal_chains_curated.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# extreme cases causal chains curated

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/extreme_cases_causal_chains_curated.csv

## Estructura

- Filas: 5
- Columnas: case_id, country, period_label, policy_or_regime, incentive_change, behavior_change, market_transmission, observed_or_expected_result, main_caution, evidence_source

## Tabla derivada

| case_id | country | period_label | policy_or_regime | incentive_change | behavior_change | market_transmission | observed_or_expected_result | main_caution | evidence_source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ddr | German Democratic Republic | state_socialist_housing_system | state_controlled_rents_and_administrative_allocation | private_return_and_price_signals_are_suppressed | households_depend_on_queue_and_connections | new_supply_and_maintenance_are_decoupled_from_market_demand | low_recorded_costs_but_persistent_shortage_and_quality_problems | Postwar reconstruction and reunification context matter | rag/reports/extremes/ddr/ddr_destatis_wirtschaft_und_statistik_1992_02.pdf |
| ussr | Soviet Union | late_soviet_housing_system | socialized_housing_and_queue_distribution | choice_and_investment_signals_weaken | households_wait_seek_swaps_or informal arrangements | allocation_rigidity_replaces_market_clearing | long_waits_mismatch_and undermaintenance | Not all outcomes are due only to property regime but also to broader command economy features | rag/reports/extremes/ussr/ussr_housing_system_and_its_reform_worldbank_1990.pdf |
| cn | China | maoist_and_pre_reform_period | work_unit_based_public_housing | allocation_is_linked_to_employment_and administration | households_rely_on_unit_assignment_and status | formal housing access is not primarily price based | coverage_for_some_groups_with low choice and shortage | This is historical China not current China | rag/reports/extremes/cn/cn_worldbank_urban_housing_reform_policy_note.pdf |
| cn | China | post_reform_mixed_housing_system | housing_marketization_and privatization | stronger ownership incentives and price signals | households purchase invest and developers scale production | credit_and_land_finance_expand the market | rapid expansion with later leverage and affordability stress | Not evidence for abolition but for transition away from it | rag/reports/extremes/cn/cn_worldbank_housing_finance_2025.pdf |
| ve | Venezuela | interventionist_mixed_housing_system | price_controls_macro_instability_and selective intervention | formal investment incentives weaken | producers_and_households shift toward delay substitution or informality | formal supply quality and market depth deteriorate | shortage_and_informal_adjustment can rise | This is not a full abolition of private housing property | metadata/extremes/wb_extremes_cn_ve_context_panel_1990_2025.csv |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.