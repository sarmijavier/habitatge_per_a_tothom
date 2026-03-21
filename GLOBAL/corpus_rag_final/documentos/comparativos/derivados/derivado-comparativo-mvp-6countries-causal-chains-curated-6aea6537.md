---
id: "derived-policy-mvp-6countries-causal-chains-curated-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp 6countries causal chains curated"
ruta_origen: "derived/policy/mvp_6countries_causal_chains_curated.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp 6countries causal chains curated

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_6countries_causal_chains_curated.csv

## Estructura

- Filas: 8
- Columnas: country_code, country, policy_case, policy_shock, incentive_change, behavior_change, market_transmission, expected_result, risk_or_side_effect, validation_source

## Tabla derivada

| country_code | country | policy_case | policy_shock | incentive_change | behavior_change | market_transmission | expected_result | risk_or_side_effect | validation_source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | Espana | rent_caps_in_tense_areas | price_reference_and_caps | lower_expected_yield_for_part_of_supply | some_landlords_delay_exit_or_reprice | available_rental_supply_can_tighten | lower_short_run_rent_growth | quality_drop_and_informal_selection | rag/reports/bde/es_bde_do2002_intervencion_publica_alquiler_revision_internacional.pdf |
| es | Espana | mortgage_consumer_protection | stronger_disclosure_and_affordability_checks | banks_face_higher_underwriting_discipline | less_aggressive_lending | credit_quality_improves | lower_household_financial_risk | credit_can_become_less_accessible_at_the_margin | rag/reports/bde/es_bde_do2314_riesgos_vulnerabilidades_vivienda.pdf |
| sg | Singapur | public_housing_scale_up | state_builds_and_allocates_at_scale | households_have_access_to_subsidized_formal_supply | demand_is_channeled_toward_hdb | public_stock_absorbs_large_share_of_need | higher_home_access_and_social_stability | high_dependency_on_state_design_choices | rag/reports/sg/sg_hdb_annual_report_2021.pdf |
| sg | Singapur | foreign_buyer_restrictions | limits_on_external_demand | lower_incentive_for_speculative_or_external_acquisition | foreign_demand_shifts_or_falls | less_pressure_on_selected_segments | lower_external_price_pressure | capital_reallocation_to_other_assets | legal/sg/sg_rpa_1976_residential_property_act.html |
| nl | Paises Bajos | allocation_plus_social_stock | priority_rules_and_large_social_sector | providers_and_municipalities_allocate_by_rule | more_targeted_access_but_longer_queues | shortages_become_visible_in_waiting_lists | strong_access_protection_for_priority_groups | lock_in_and_queueing | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| at | Austria | nonprofit_and_regulated_rental_model | limited_profit_and_regulated_rents | developers_accept_lower_margin_for_scale_and_stability | stable_long_horizon_supply_in_affordable_segments | rent_volatility_stays_lower | better_affordability_and_resilience | requires_institutions_land_policy_and_finance | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| br | Brasil | minha_casa_minha_vida | subsidy_credit_and_programmed_production | low_income_households_gain_formal_entry_path | demand_and_supply_move_through_program_channels | new_units_expand_access_to_formal_housing | higher_home_access_for_target_groups | peripheral_location_quality_and_fiscal_costs | legal/br/br_lei_2009_minha_casa_minha_vida.html |
| cu | Cuba | state_controlled_housing_system | administrative_allocation_and_limited_market_pricing | private_investment_signals_remain_weak | maintenance_and_exchange_depend_on_state_or_informal_channels | formal_market_adjustment_is_slow | high_control_but_low_flexibility | persistent_shortage_and_hidden_informality | legal/cu/processed/cu_ley_65_1988_vivienda_general_fragmento_64_85.articles.json |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.