---
id: "derived-policy-mvp-6countries-legal-mechanisms-curated-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp 6countries legal mecanismos curated"
ruta_origen: "derived/policy/mvp_6countries_legal_mechanisms_curated.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp 6countries legal mecanismos curated

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_6countries_legal_mechanisms_curated.csv

## Estructura

- Filas: 12
- Columnas: country_code, country, law_or_policy, event_year, mechanism_type, mechanism_label, target_group, market_segment, expected_primary_effect, expected_secondary_effect, legal_source, validation_source

## Tabla derivada

| country_code | country | law_or_policy | event_year | mechanism_type | mechanism_label | target_group | market_segment | expected_primary_effect | expected_secondary_effect | legal_source | validation_source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | Espana | es_ley_2023_vivienda.xml | 2023 | rent_regulation | zonas tensionadas y referencia de precios | tenants and large landlords | alquiler | slow_rent_growth | possible_supply_contraction | legal/es/es_ley_2023_vivienda.xml | rag/reports/bde/es_bde_do2002_intervencion_publica_alquiler_revision_internacional.pdf |
| es | Espana | es_ley_2019_credito_inmobiliario.xml | 2019 | credit_regulation | consumer mortgage protection | homebuyers and banks | compra | safer_credit | less_mispricing | legal/es/es_ley_2019_credito_inmobiliario.xml | rag/reports/bde/es_bde_do2314_riesgos_vulnerabilidades_vivienda.pdf |
| sg | Singapur | sg_hda_1959_housing_development_act.html | 1959 | public_housing_supply | state led housing development and allocation | households and first time buyers | compra y acceso | large_scale_affordable_supply | high_state_dependence | legal/sg/sg_hda_1959_housing_development_act.html | rag/reports/sg/sg_hdb_annual_report_2021.pdf |
| sg | Singapur | sg_rpa_1976_residential_property_act.html | 1976 | demand_management | restrictions on foreign residential ownership | foreign buyers and investors | compra | lower_external_speculative_pressure | possible_capital_diversion | legal/sg/sg_rpa_1976_residential_property_act.html | metadata/global/worldbank/investment/wb_6countries_fdi_net_inflows_pct_gdp.csv |
| nl | Paises Bajos | nl_ley_2014_huisvesting.xml | 2014 | allocation_regulation | housing allocation permits and local distribution | municipalities and applicants | alquiler y acceso | priority_access_management | queue_and_shortage_visibility | legal/nl/nl_ley_2014_huisvesting.xml | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx |
| nl | Paises Bajos | nl_bw7_huur.xml | 1992 | tenant_protection | civil code rent and lease rules | tenants and landlords | alquiler | strong_tenant_security | lower_turnover | legal/nl/nl_bw7_huur.xml | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| at | Austria | at_mrg_arrendamientos.html | 1981 | rent_regulation | regulated rents and tenure stability | tenants and landlords | alquiler | stable_rental_market | lower_market_volatility | legal/at/at_mrg_arrendamientos.html | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx |
| at | Austria | at_wgg_vivienda_social.pdf | 1979 | public_housing_supply | limited profit housing framework | nonprofit providers and households | alquiler y acceso | large_nonprofit_supply | high_fiscal_and_governance_needs | legal/at/at_wgg_vivienda_social.pdf | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx |
| br | Brasil | br_lei_1991_inquilinato.html | 1991 | tenant_protection | tenancy framework for urban leases | tenants and landlords | alquiler | clearer_contract_rules | litigation_risk_if_enforcement_is_weak | legal/br/br_lei_1991_inquilinato.html | metadata/global/worldbank/economic/wb_6countries_unemployment_rate.csv |
| br | Brasil | br_lei_2009_minha_casa_minha_vida.html | 2009 | public_subsidy_and_credit | mass subsidized housing and ownership support | low income households | compra y acceso | higher_access_to_formal_housing | quality_location_and_fiscal_risk | legal/br/br_lei_2009_minha_casa_minha_vida.html | rag/reports/oecd/oecd_housing_and_inclusive_growth_2020.pdf |
| cu | Cuba | cu_ley_65_1988_vivienda_general.xml | 1988 | state_allocation | state centered allocation and control | households and state entities | acceso y tenencia | high_formal_control | low_market_flexibility | legal/cu/raw/cu_ley_65_1988_vivienda_general.xml | metadata/global/worldbank/economic/wb_6countries_gdp_per_capita_current_usd.csv |
| cu | Cuba | cu_dl_342_2016_vivienda.pdf | 2016 | market_adjustment | selective update of housing transactions and administration | households and state entities | acceso y tenencia | partial_market_flexibility | persistent_shortage_and_informality | legal/cu/raw/cu_dl_2016_vivienda.pdf | metadata/global/worldbank/migration/wb_6countries_net_migration.csv |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.