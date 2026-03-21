import type { SourceItem } from "../lib/types";

export function SourcesPanel({ sources }: { sources: SourceItem[] }) {
  if (!sources.length) {
    return null;
  }

  return (
    <section className="card meta-card stack">
      <div className="eyebrow">Fuentes</div>
      <div className="sources">
        {sources.map((source, index) => (
          <article key={`${source.title}-${index}`} className="source-item">
            <strong>{source.title}</strong>
            <div className="muted" style={{ marginTop: 4 }}>
              {source.type === "web"
                ? source.href
                : `${source.type}${source.country ? ` · ${source.country}` : ""}`}
            </div>
            {source.href ? (
              <a href={source.href} target="_blank" rel="noreferrer">
                Abrir fuente
              </a>
            ) : null}
            {source.path ? <div className="muted">{source.path}</div> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
