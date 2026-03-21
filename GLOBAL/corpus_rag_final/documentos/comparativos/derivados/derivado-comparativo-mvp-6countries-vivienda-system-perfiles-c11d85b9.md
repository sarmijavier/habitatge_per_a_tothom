---
id: "derived-policy-mvp-6countries-housing-system-profiles-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp 6countries vivienda system perfiles"
ruta_origen: "derived/policy/mvp_6countries_housing_system_profiles.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp 6countries vivienda system perfiles

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_6countries_housing_system_profiles.csv

## Estructura

- Filas: 6
- Columnas: country_code, country, housing_model, public_housing_role, rental_regulation_intensity, ownership_orientation, demand_pressure_driver, investor_exposure, tourism_pressure, principal_strength, principal_risk, primary_sources

## Tabla derivada

| country_code | country | housing_model | public_housing_role | rental_regulation_intensity | ownership_orientation | demand_pressure_driver | investor_exposure | tourism_pressure | principal_strength | principal_risk | primary_sources |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | Espana | mixed_market_with_growing_regulation | limited_but_policy_relevant | medium_to_high | ownership_biased | urban_jobs_household_formation_and_tourism | medium_and_rising | in_selected_cities_high | strong_legal_and_statistical_base | supply_tension_and_affordability_gap | derived/policy/es_legal_mechanisms_curated.csv |
| sg | Singapur | state_led_homeownership_system | system_central | high_with_strong_state_coordination | ownership_and_public_allocation_biased | land_scarcity_population_and_external_demand | managed_by_policy | medium | large_scale_delivery_and targeting | high_path_dependence_on_state_design | rag/reports/sg/sg_hdb_annual_report_2021.pdf |
| nl | Paises Bajos | regulated_rental_plus_large_social_sector | very_relevant | high | mixed | household_growth_and_supply_constraints | medium | medium | strong_social_rental_buffer | queues_and rigid allocation frictions | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| at | Austria | nonprofit_affordable_rental_model | very_relevant | high | mixed | urban demand and managed supply | medium | low_to_medium | stable_affordable_rental_institutions | needs_land_finance_and long horizon governance | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| br | Brasil | credit_and_subsidy_driven_access_model | targeted_programmatic_role | medium | ownership_biased | income_growth_credit_conditions_and_demography | medium | low_to_medium | scalable_access_through_mass_programs | location_quality_and fiscal burden | legal/br/br_lei_2009_minha_casa_minha_vida.html |
| cu | Cuba | state_controlled_housing_system | structural_and_state_central | very_high | administrative_tenure_biased | resource_constraints_and administrative allocation | low_formal_high_informal | low | high_control_over_formal_allocation | shortage_low_flexibility_and hidden informality | legal/cu/processed/cu_ley_65_1988_vivienda_general_fragmento_64_85.articles.json |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.