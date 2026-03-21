---
id: "derived-policy-mvp-6countries-context-source-map-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp 6countries contexto fuentes map"
ruta_origen: "derived/policy/mvp_6countries_context_source_map.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp 6countries contexto fuentes map

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_6countries_context_source_map.csv

## Estructura

- Filas: 6
- Columnas: country_code, country, macro_context_source, demography_source, migration_source, tourism_source, housing_market_source, policy_source, public_housing_source, flagship_report

## Tabla derivada

| country_code | country | macro_context_source | demography_source | migration_source | tourism_source | housing_market_source | policy_source | public_housing_source | flagship_report |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| es | Espana | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/es/demography/es_ine_poblacion_residente_edad_sexo_ccaa.csv | metadata/es/demography/es_ine_migraciones_exteriores_pais_nacimiento_nacionalidad.csv | metadata/es/tourism/es_ine_viviendas_turisticas.csv | metadata/es/supply/es_bde_sintesis_indicadores_mercado_inmobiliario_si_1_5.xlsx | derived/policy/es_legal_mechanisms_curated.csv | rag/reports/mivau_special/es_mivau_boletin_especial_vivienda_social_2020.pdf | rag/reports/bde/es_bde_do2433_mercado_vivienda_comparacion_internacional.pdf |
| sg | Singapur | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/global/worldbank/demography/wb_6countries_population_density.csv | metadata/global/worldbank/migration/wb_6countries_net_migration.csv | metadata/global/worldbank/tourism/wb_6countries_international_tourism_arrivals.csv | legal/sg/sg_hda_1959_housing_development_act.html | derived/policy/mvp_6countries_legal_mechanisms_curated.csv | rag/reports/sg/sg_hdb_annual_report_2021.pdf | rag/reports/sg/sg_hdb_annual_report_2021.pdf |
| nl | Paises Bajos | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/global/worldbank/demography/wb_6countries_population_density.csv | metadata/global/worldbank/migration/wb_6countries_net_migration.csv | metadata/global/worldbank/tourism/wb_6countries_international_tourism_arrivals.csv | metadata/oecd/market/oecd_hm1_5_housing_stock_by_dwelling_type.xlsx | derived/policy/mvp_6countries_legal_mechanisms_curated.csv | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | rag/reports/oecd/country_notes/oecd_countrynote_nld_homelessness.pdf |
| at | Austria | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/global/worldbank/demography/wb_6countries_population_density.csv | metadata/global/worldbank/migration/wb_6countries_net_migration.csv | metadata/global/worldbank/tourism/wb_6countries_international_tourism_arrivals.csv | metadata/oecd/market/oecd_hm1_5_housing_stock_by_dwelling_type.xlsx | derived/policy/mvp_6countries_legal_mechanisms_curated.csv | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | rag/reports/oecd/country_notes/oecd_countrynote_aut_homelessness.pdf |
| br | Brasil | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/global/worldbank/demography/wb_6countries_population_total.csv | metadata/global/worldbank/migration/wb_6countries_net_migration.csv | metadata/global/worldbank/tourism/wb_6countries_international_tourism_arrivals.csv | metadata/global/worldbank/economic/wb_6countries_lending_interest_rate.csv | derived/policy/mvp_6countries_legal_mechanisms_curated.csv | legal/br/br_lei_2009_minha_casa_minha_vida.html | rag/reports/oecd/oecd_housing_and_inclusive_growth_2020.pdf |
| cu | Cuba | metadata/global/worldbank/wb_6countries_context_panel_2010_2025.csv | metadata/global/worldbank/demography/wb_6countries_population_total.csv | metadata/global/worldbank/migration/wb_6countries_net_migration.csv | metadata/global/worldbank/tourism/wb_6countries_international_tourism_arrivals.csv | legal/cu/processed/cu_ley_65_1988_vivienda_general_fragmento_64_85.clean.txt | derived/policy/mvp_6countries_legal_mechanisms_curated.csv | legal/cu/processed/cu_ley_65_1988_vivienda_general_fragmento_64_85.articles.json | legal/cu/raw/cu_dl_2016_vivienda.pdf |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.