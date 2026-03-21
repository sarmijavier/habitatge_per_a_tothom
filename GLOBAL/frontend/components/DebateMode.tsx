"use client";

import { useState } from "react";

type DebateResult = {
  topic: string;
  defensor: string;
  critico: string;
  veredicto: string;
};

export function DebateMode() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<DebateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDebate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), context: context.trim() }),
      });

      if (!response.ok) throw new Error("Error en el debate");
      const data = await response.json() as DebateResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card stack" style={{ padding: 24 }}>
      <div>
        <div className="eyebrow">Debate IA vs IA</div>
        <h2 style={{ margin: "12px 0 4px" }}>¿Esta medida funcionaría?</h2>
        <p className="muted">
          Introduce una ley o medida de vivienda y dos IAs debatirán a favor y en contra.
          Un árbitro dará el veredicto final basado en evidencia histórica.
        </p>
      </div>

      <div className="stack">
        <label className="stack">
          <span>Medida o ley a debatir</span>
          <textarea
            className="textarea"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ej: Limitar el alquiler al 5% en zonas tensionadas de España"
            rows={2}
          />
        </label>
        <label className="stack">
          <span>Contexto adicional (opcional)</span>
          <textarea
            className="textarea"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Ej: España 2025, mercado con alta presión turística en Barcelona y Madrid"
            rows={2}
          />
        </label>
        <button
          className="primary-button"
          type="button"
          disabled={loading || !topic.trim()}
          onClick={handleDebate}
        >
          {loading ? "Debatiendo..." : "⚔️ Iniciar debate"}
        </button>
      </div>

      {error && (
        <div className="card meta-card" style={{ borderColor: "rgba(123,61,43,0.35)" }}>
          <strong style={{ color: "var(--danger)" }}>Error</strong>
          <p className="muted">{error}</p>
        </div>
      )}

      {result && (
        <div className="stack" style={{ marginTop: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Defensora */}
            <div className="card meta-card stack" style={{ borderColor: "rgba(34,197,94,0.4)" }}>
              <div className="eyebrow" style={{ color: "var(--success, #22c55e)" }}>
                ✅ IA Defensora
              </div>
              <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{result.defensor}</p>
            </div>

            {/* Crítica */}
            <div className="card meta-card stack" style={{ borderColor: "rgba(239,68,68,0.4)" }}>
              <div className="eyebrow" style={{ color: "var(--danger, #ef4444)" }}>
                ❌ IA Crítica
              </div>
              <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{result.critico}</p>
            </div>
          </div>

          {/* Veredicto */}
          <div className="card meta-card stack" style={{ borderColor: "rgba(234,179,8,0.4)", marginTop: 8 }}>
            <div className="eyebrow" style={{ color: "var(--warning, #eab308)" }}>
              ⚖️ Veredicto del Árbitro
            </div>
            <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{result.veredicto}</p>
          </div>
        </div>
      )}
    </section>
  );
}