# Dashboard Chatbot

A minimal full-stack application where an AI chatbot can render interactive content on a live dashboard by responding with structured commands.

## Prerequisites

- **Node 20+**
- A **Gemini API key** (get one at [Google AI Studio](https://aistudio.google.com/))

## Getting started

1. Set your Gemini API key in `backend/.env`:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set GEMINI_API_KEY=your_key_here
```

2. Install dependencies and start:

```bash
npm install
npm run dev
```

The Angular dev server starts on `http://localhost:4200` and the NestJS API on `http://localhost:3000`.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Your Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Gemini model to use |

## Chat-to-dashboard flow

When you send a message, the NestJS backend calls the Google Gemini API with a system prompt that instructs the model to act as a dashboard assistant and to always append a `CMD:{...}` JSON line at the end of every reply. The backend strips that line from the visible reply, parses it into a typed `DashboardCommand`, and returns both to the frontend. The Angular `ChatPanelComponent` emits the command up to `AppComponent`, which passes it down as an `@Input()` to `DashboardPanelComponent`. The dashboard then switches between widgets — SVG bar chart, text card, HTML table, or a cleared/placeholder state — based on the command type, updating instantly without any page reload.

## Available command types

| Prompt example | Command rendered |
|---|---|
| "Draw me a bar chart of monthly sales: 12, 45, 33, 67, 20" | SVG bar chart |
| "Show me a summary of Q3 results" | Text card |
| "Display a table with columns Name, Age, City and two example rows" | HTML table |
| "Clear the dashboard" | Clears to placeholder |
| "What is the capital of France?" | Text reply only, no dashboard change |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both backend and frontend concurrently |
| `npm run build` | Build both for production |
| `npm run lint` | Lint both projects |
