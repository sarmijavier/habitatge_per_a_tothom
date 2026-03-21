---
id: "derived-policy-mvp-public-housing-source-map-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp publica vivienda fuentes map"
ruta_origen: "derived/policy/mvp_public_housing_source_map.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp publica vivienda fuentes map

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_public_housing_source_map.csv

## Estructura

- Filas: 6
- Columnas: country_code, country, stock_source, spending_source, characteristics_source, deep_report

## Tabla derivada

| country_code | country | stock_source | spending_source | characteristics_source | deep_report |
| --- | --- | --- | --- | --- | --- |
| sg | Singapur | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | rag/reports/sg/sg_hdb_annual_report_2021.pdf |
| at | Austria | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | legal/at/at_wgg_vivienda_social.pdf |
| nl | Paises Bajos | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | rag/reports/oecd/oecd_housing_and_inclusive_growth_2020.pdf |
| es | Espana | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | rag/reports/es/es_mivau_observatorio_vivienda_suelo_54_2t2025.pdf |
| br | Brasil | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | legal/br/br_lei_2009_minha_casa_minha_vida.html |
| cu | Cuba | metadata/oecd/public_housing/oecd_ph4_2_social_rental_housing_stock.xlsx | metadata/oecd/public_housing/oecd_ph4_1_public_spending_social_rental_housing.xlsx | metadata/oecd/public_housing/oecd_ph4_3_characteristics_social_rental_housing.xlsx | legal/cu/raw/cu_ley_65_1988_vivienda_general.xml |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.