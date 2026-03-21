# GLOBAL MVP Local

Prototipo local completo para el MVP con estos cuatro países:

- `España`: target
- `Singapur`: caso de éxito
- `Cuba`: fracaso sistémico
- `Venezuela`: fracaso sistémico

## Qué incluye

- `datos_crudos_finales/`
  - fuentes legales, datasets cuantitativos y reportes originales del recorte final
- `corpus_rag_final/`
  - markdowns y chunks para RAG
- `backend/`
  - FastAPI + LangChain + Gemini embeddings + DuckDB + routing multi-IA
- `frontend/`
  - Next.js + TypeScript con onboarding, chat, modos de respuesta y panel de fuentes

## Arquitectura del prototipo

### Backend Python

- `FastAPI`
  - API local para sesiones, chat, salud y países
- `LangChain + Chroma`
  - RAG sobre markdown interno del MVP
- `DuckDB`
  - tablas base para perfiles, eventos, cadenas causales y contexto país
- `Routing multi-IA`
  - `Groq` para preguntas breves, FAQ, clasificación y reformulación
  - `Gemini` para vivienda, contratos, ayudas y contexto largo
  - `Mistral` para análisis más densos, simulación o fallback
- `Fallback web`
  - búsqueda web cuando falte contexto interno o cuando el país consultado esté fuera del MVP
- `CTA ciudadano`
  - activa “Vivienda Clara” cuando detecta una necesidad práctica de acceso a vivienda

### Frontend Next.js

- onboarding por perfil
- selección inicial de país foco
- chat único GLOBAL
- modos: `Resumen`, `Más detalle`, `Ver datos`, `Simular`
- panel de routing y fuentes
- gráfico simple cuando la respuesta trae datos estructurados

## Flujo de producto ya implementado

1. el usuario entra y elige perfil
2. elige país foco inicial
3. escribe una pregunta o escenario
4. GLOBAL decide ruta de proveedor
5. intenta usar RAG interno y DuckDB
6. si falta cobertura o el país es externo, activa búsqueda web
7. devuelve una respuesta adaptada al perfil y al modo
8. si detecta necesidad ciudadana, añade CTA de ayuda

## Arranque local

### 1. Backend

En `backend/`:

```bat
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
copy .env.example .env
python scripts\bootstrap_duckdb.py
python scripts\build_rag_index.py
python scripts\run_api.py
```

Notas:

- si no quieres gastar claves al principio, activa `GLOBAL_DEMO_MODE=true`
- para construir embeddings con Gemini free tier quizá convenga limitar:
  - `GLOBAL_EMBEDDING_BATCH_SIZE=20`
  - `GLOBAL_EMBEDDING_RETRY_SECONDS=65`
  - `GLOBAL_MAX_DOCUMENTS=20`
  - `GLOBAL_MAX_CHUNKS=120`

### 2. Frontend

En `frontend/`:

```bat
copy .env.local.example .env.local
npm install
npm run dev
```

La UI quedará en:

- `http://localhost:3000`

La API quedará en:

- `http://127.0.0.1:8000`

## Variables de entorno clave

### Backend

- `GOOGLE_API_KEY`
- `GROQ_API_KEY`
- `MISTRAL_API_KEY`
- `GLOBAL_DEMO_MODE`
- `GLOBAL_INCLUDE_CATEGORIES`
- `GLOBAL_INCLUDE_COUNTRIES`

### Frontend

- `NEXT_PUBLIC_GLOBAL_API_BASE_URL`

## Estado actual

### Ya listo

- paquete reducido de datos para 4 países
- corpus markdown RAG filtrado
- backend FastAPI modular
- sesiones en memoria
- routing multi-IA con fallback
- DuckDB bootstrap básico
- frontend Next.js compilando en producción
- prueba local de flujo backend en modo demo

### Aún por perfeccionar

- ampliar las tablas DuckDB más allá del núcleo actual
- mejorar la búsqueda web para leyes concretas y fuentes más ricas
- conectar visualizaciones con más series temporales de vivienda españolas
- persistencia real de sesiones y usuario
- autenticación
- trazas/observabilidad
- tests automáticos de integración
