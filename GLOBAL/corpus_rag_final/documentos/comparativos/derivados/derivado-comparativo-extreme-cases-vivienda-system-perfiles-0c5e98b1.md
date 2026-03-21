---
id: "derived-policy-extreme-cases-housing-system-profiles-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "extreme cases vivienda system perfiles"
ruta_origen: "derived/policy/extreme_cases_housing_system_profiles.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# extreme cases vivienda system perfiles

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/extreme_cases_housing_system_profiles.csv

## Estructura

- Filas: 5
- Columnas: case_id, country, period_label, allocation_mode, dominant_tenure_pattern, supply_model, maintenance_incentive, informal_or_black_market_risk, mobility_effect, observed_strength, observed_risk, core_evidence

## Tabla derivada

| case_id | country | period_label | allocation_mode | dominant_tenure_pattern | supply_model | maintenance_incentive | informal_or_black_market_risk | mobility_effect | observed_strength | observed_risk | core_evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ddr | German Democratic Republic | state_socialist_housing_system | administrative_allocation_and_priority_rules | state_and_cooperative_control | state_planning_and_prefabricated_mass_construction | weak_when_rents_and_returns_are_administered | high_under_shortage_conditions | low_residential_mobility | basic_access_and_low_recorded_housing_costs | chronic_shortage_quality_gap_and_waiting_lists | rag/reports/extremes/ddr/ddr_destatis_wirtschaft_und_statistik_1990_11.pdf |
| ussr | Soviet Union | late_soviet_housing_system | queue_and_enterprise_or_state_allocation | state_socialized_with_use_rights | administrative_construction_targets | weak_for_repairs_and_quality_upgrading | high_under_persistent_shortage | low_mobility_and_mismatch | broad_formal_coverage_goal | long_waiting_times_undermaintenance_and_hidden_exchange | rag/reports/extremes/ussr/ussr_housing_system_and_its_reform_worldbank_1990.pdf |
| cn | China | maoist_and_pre_reform_period | work_unit_and_public_allocation | public_and_collective_tenure | public_provision_linked_to_employment | weak_for_household_choice_and upgrading | medium_to_high | low_mobility_inside_allocation_system | urban_access_tied_to_employment_and planning | shortage_low_choice_and weak price signals | rag/reports/extremes/cn/cn_worldbank_urban_housing_reform_policy_note.pdf |
| cn | China | post_reform_mixed_housing_system | market_allocation_with_strong_state_steering | mixed_with_high_homeownership | market_development_plus_state_guidance | stronger_than_pre_reform_but_policy_sensitive | medium | greater_mobility_than_pre_reform | rapid_scale_and ownership expansion | volatility_leverage_and developer risk | rag/reports/extremes/cn/cn_worldbank_housing_finance_2025.pdf |
| ve | Venezuela | interventionist_mixed_housing_system | mixed_allocation_with_controls_and_public_programs | mixed_property_with informal segment | mixed_public_programs_and constrained private response | eroded_under_macro_instability | high | falling_formal_mobility_with rising informality | targeted_access_via_public_programs | supply_deterioration_inflation_and informal_adjustment | rag/reports/extremes/ve/ve_worldbank_urbanization_and_housing_investment.pdf |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.