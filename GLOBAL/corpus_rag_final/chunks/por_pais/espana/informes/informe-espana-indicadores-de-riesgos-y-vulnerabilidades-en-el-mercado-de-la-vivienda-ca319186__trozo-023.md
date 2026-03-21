---
id: "rag-reports-bde-es-bde-do2314-riesgos-vulnerabilidades-vivienda-pdf__trozo_023"
tipo_documento: "chunk"
categoria: "informes"
pais_codigo: "es"
pais: "España"
documento_padre: "documentos/por_pais/espana/informes/informe-espana-indicadores-de-riesgos-y-vulnerabilidades-en-el-mercado-de-la-vivienda-ca319186.md"
orden_chunk: 23
titulo: "METODOLOGÍA DE ELABORACIÓN DEL ÍNDICE SINTÉTICO PARA EL MERCADO DE LA VIVIENDA"
caracteres: 3669
---
# METODOLOGÍA DE ELABORACIÓN DEL ÍNDICE SINTÉTICO PARA EL MERCADO DE LA VIVIENDA

## METODOLOGÍA DE ELABORACIÓN DEL ÍNDICE SINTÉTICO PARA EL MERCADO DE LA VIVIENDA

Esquema 1
FUENTE: Elaboración propia.
Índice sintético
A. Actividad real C. Condiciones crediticias
D. Situación patrimonial hogares
Actividad (construcción, compraventas...)
Precios
Sobrevaloración
Evolución crédito
Estándares crediticios
Endeudamiento, ahorro
B. Valoración
Nivel 3
Índice final de riesgo
Nivel 2
Índices intermedios de riesgo
Nivel 1
Transformación de indicadores del monitor en variables con características homogéneas

BANCO DE ESPAÑA21DOCUMENTO OCASIONAL N.º 2314
Para hacer frente a estos inconvenientes, se ha optado por transformar los indicadores a partir de sus distribuciones acumuladas empíricas (ECDF, por sus siglas en inglés), en línea con la literatura de índices de estrés financiero (Holló, Kremer y Lo Duca, 2012). El cálculo de las ECDF es relativamente inmediato. En primer lugar, se ordenan los valores observados de los indicadores ×t con tamaño muestral T de modo que para cada serie original del indicador
×t = (×1, ×2, ..., ×T) se obtiene una nueva serie con sus valores ordenados ×[t] = (×[1], ×[2], ..., ×[T]).
En esta serie transformada, ×[1] representa el menor valor del indicador y ×[T] el valor mayor.
Posteriormente, para obtener el indicador transformado zt, se asigna el ranking numérico a cada valor de ×t (r) y este resultado se divide entre el tamaño muestral T:
T
r zt = para ×[r] ≤ ×t < ×[r+1], r = 1, 2, ..., T (1)
donde r indica la posición asignada a cada valor de la variable15. Las nuevas variables están acotadas entre 1/T y 1, valores que representan los valores mínimo y máximo respectivamente de la distribución del indicador original. Es decir, un valor cercano a cero indicaría que ese dato estaría próximo al mínimo de la variable, mientras que un valor próximo a uno indica que es un valor próximo al máximo. Para la construcción del índice sintético del mercado de la vivienda y los índices intermedios, las variables individuales transformadas, zt, se han calculado de tal modo que valores más altos indican un riesgo más alto y valores más bajos un riesgo más bajo16. Además, para conseguir un índice sintético más estable, todas las transformaciones se calculan de forma recursiva desde el cuarto trimestre de 2013. Esto es, antes de esa fecha, la muestra considerada para el cálculo de los indicadores transformados (zt) es siempre la misma. Desde esa fecha, se recalculan los indicadores transformados cada vez que se incorporan nuevas observaciones.
Para ilustrar esta trasformación, el gráfico 1 muestra uno de los indicadores de desequilibrio en los precios de la vivienda (el que utiliza el filtro de Hodrick-Prescott) en su forma original y tras la trasformación basada en la ECDF. El indicador transformado presenta un patrón muy similar al del indicador original: el máximo de ambos se alcanza justo antes de la crisis financiera, mientras que el mínimo se produce en 2013. En este caso, valores más altos (bajos) serían consistentes con un elevado (bajo) grado de sobrevaloración de la vivienda, asociado a un mayor (menor) nivel de vulnerabilidad.
Por construcción, la distancia entre dos observaciones consecutivas en los indicadores transformados es siempre la misma (1/T), por lo que estadísticos como la media o la varianza son comparables entre estos indicadores. Además, con esta metodología resulta más sencillo distinguir puntos de inflexión en el ciclo inmobiliario. Esto se debe a que las variaciones en las variables transformadas son más acusadas en los puntos centrales de la distribución

15 A los valores repetidos se les asigna la media de su posición en la ordenación de la variable.
