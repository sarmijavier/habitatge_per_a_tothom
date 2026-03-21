---
id: "derived-policy-mvp-tenant-protection-source-map-csv"
tipo_documento: "derivado"
categoria: "derivados"
subcategoria: "policy"
pais_codigo: "comparativo"
pais: "Comparativo"
titulo: "mvp tenant protection fuentes map"
ruta_origen: "derived/policy/mvp_tenant_protection_source_map.csv"
extension_origen: ".csv"
preparado_para_rag: true
fuente_oficial_url: ""
---
# mvp tenant protection fuentes map

## Ficha

- Tipo de documento: derivado
- Ruta origen: derived/policy/mvp_tenant_protection_source_map.csv

## Estructura

- Filas: 6
- Columnas: country_code, country, primary_legal_source, secondary_legal_source, comparative_policy_source, notes

## Tabla derivada

| country_code | country | primary_legal_source | secondary_legal_source | comparative_policy_source | notes |
| --- | --- | --- | --- | --- | --- |
| es | Espana | legal/es/es_ley_1994_lau.xml | legal/es/es_rdl_2019_alquiler.xml | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Base de duracion contractual y actualizaciones de renta |
| sg | Singapur | legal/sg/sg_hda_1959_housing_development_act.html | legal/sg/sg_rpa_1976_residential_property_act.html | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Proteccion mas indirecta via oferta publica y regulacion de acceso |
| nl | Paises Bajos | legal/nl/nl_bw7_huur.xml | legal/nl/nl_ley_2014_huisvesting.xml | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Marco fuerte de alquiler y asignacion de vivienda |
| at | Austria | legal/at/at_mrg_arrendamientos.html | legal/at/at_wgg_vivienda_social.pdf | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Combina regulacion de alquiler y vivienda social |
| br | Brasil | legal/br/br_lei_1991_inquilinato.html | legal/br/br_lei_2009_minha_casa_minha_vida.html | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Proteccion contractual mas acceso via politica publica |
| cu | Cuba | legal/cu/raw/cu_ley_65_1988_vivienda_general.xml | legal/cu/raw/cu_dl_2016_vivienda.pdf | metadata/oecd/policy/oecd_ph6_1_rental_regulation.xlsx | Caso extremo de intervencion estatal; fuente legal parcial |

## Uso recomendado para GLOBAL

- Alta prioridad para prompts, reglas y explicaciones.
- Muy útil para retrieval estructurado y comparación entre mecanismos o países.