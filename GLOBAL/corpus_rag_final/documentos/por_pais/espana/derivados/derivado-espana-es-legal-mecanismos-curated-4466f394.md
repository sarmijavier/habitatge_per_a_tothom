---
id: "derived-policy-es-legal-mechanisms-curated-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "es"
pais: "España"
titulo: "es legal mecanismos curated"
ruta_origen: "derived/policy/es_legal_mechanisms_curated.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# es legal mecanismos curated

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/es_legal_mechanisms_curated.csv
- País principal: España

## Estructura

- Filas: 8
- Columnas: country_code, country, law_or_policy, event_year, legal_scope, mechanism_type, mechanism_label, affected_actor, market_segment, expected_direction, short_theory, evidence_priority_source, evidence_secondary_source

## Tabla derivada

| country_code | country | law_or_policy | event_year | legal_scope | mechanism_type | mechanism_label | affected_actor | market_segment | expected_direction | short_theory | evidence_priority_source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | Espana | es_ley_1994_lau.xml | 1994 | arrendamientos urbanos | tenant_protection | duracion minima y prorroga | inquilinos y pequenos propietarios | alquiler | more_stability_lower_turnover | Longer leases increase tenant stability and reduce forced rotation | metadata/es/market/es_ine_ipc_alquiler_vivienda_nacional.csv |
| es | Espana | es_rdl_2018_alquiler.xml | 2018 | reforma del alquiler | tenant_protection | extension de contratos y prorroga | inquilinos y propietarios | alquiler | more_stability_possible_supply_tension | Contract extensions protect tenants but can reduce flexibility on the supply side | metadata/es/market/es_ine_ipva_alquiler_ccaa_tamano_vivienda.csv |
| es | Espana | es_rdl_2019_alquiler.xml | 2019 | reforma del alquiler | tenant_protection | limite de garantias y gastos de gestion | inquilinos y agencias | alquiler | lower_entry_costs | Lower upfront costs can ease entry for vulnerable renters | metadata/es/judicial/es_cgpj_desahucios_anual_2025.xlsx |
| es | Espana | es_ley_2019_credito_inmobiliario.xml | 2019 | credito hipotecario | credit_regulation | transparencia y control de comercializacion | compradores y bancos | compra | safer_credit_lower_mispricing | Stronger disclosure rules reduce opaque lending and improve loan quality | metadata/es/credit/es_bde_tipos_interes_hipotecarios.zip |
| es | Espana | es_ley_2023_vivienda.xml | 2023 | politica de vivienda | rent_regulation | zonas tensionadas y grandes tenedores | inquilinos propietarios e inversores | alquiler | lower_rent_growth_with_supply_risk | Rent caps can slow rents in the short run but may discourage some supply | metadata/es/market/es_ine_ipc_alquiler_vivienda_nacional.csv |
| es | Espana | es_rdl_2012_deudores.xml | 2012 | proteccion hipotecaria | debt_relief | codigo de buenas practicas y alivio hipotecario | hipotecados vulnerables | compra | lower_distress_and_foreclosures | Debt relief reduces the probability of severe household distress | metadata/es/judicial/es_ine_ejecuciones_hipotecarias_ccaa.csv |
| es | Espana | es_ley_2013_hipotecarios.xml | 2013 | mercado hipotecario y ejecucion | debt_relief | reforma de ejecucion y proteccion deudor | hipotecados vulnerables | compra | lower_foreclosure_pressure | Procedural protection can reduce or delay foreclosure pressure | metadata/es/judicial/es_ine_ejecuciones_tipo_vivienda.csv |
| es | Espana | es_ley_2009_socimis.xml | 2009 | inversion y fiscalidad | investment_incentive | vehiculo fiscal para alquiler e inversion | inversores y operadores | alquiler y compra | more_institutional_capital | Tax advantaged vehicles can attract capital and professionalize rental portfolios | metadata/global/worldbank/investment/wb_6countries_fdi_net_inflows_pct_gdp.csv |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.