"use client";

import { useEffect, useMemo, useState } from "react";

import { ChatShortcutBar } from "../components/ChatShortcutBar";
import { MiniChart } from "../components/MiniChart";
import { OnboardingForm } from "../components/OnboardingForm";
import { SourcesPanel } from "../components/SourcesPanel";
import {
  ApiError,
  fetchCountries,
  fetchSession,
  sendChatMessage,
  startSession,
} from "../lib/api";
import type {
  ChatResponse,
  CountryDefinition,
  OnboardingProfile,
  ResponseMode,
  SessionState,
} from "../lib/types";

type Message = {
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
};

const RESPONSE_MODE_METADATA: Record<
  ResponseMode,
  { label: string; shortcutMessage: string; instruction: string }
> = {
  summary: {
    label: "Resumen",
    shortcutMessage: "Hazme un resumen de esto",
    instruction:
      "Quiero un resumen más corto y claro de la consulta anterior, usando el contexto ya hablado.",
  },
  detail: {
    label: "Más detalle",
    shortcutMessage: "Quiero más detalle sobre esto",
    instruction:
      "Desarrolla con más detalle la consulta anterior, ampliando mecanismos, matices y comparativas.",
  },
  data: {
    label: "Ver datos",
    shortcutMessage: "Quiero ver los datos relacionados",
    instruction:
      "Quiero una respuesta orientada a datos sobre la consulta anterior, con evidencia, señales cuantitativas y contexto estructurado.",
  },
  simulate: {
    label: "Simular",
    shortcutMessage: "Quiero simular este escenario",
    instruction:
      "Quiero una simulación inicial sobre la consulta anterior, con impactos probables, riesgos, supuestos y trade-offs.",
  },
};

function getLastAssistantResponse(messages: Message[]): ChatResponse | null {
  return [...messages].reverse().find((message) => message.response)?.response ?? null;
}

function findRelatedUserMessage(messages: Message[], anchorIndex: number): string {
  for (let index = anchorIndex - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return messages[index].content;
    }
  }

  return "";
}

function buildRecentContext(messages: Message[], anchorIndex: number): string {
  const startIndex = Math.max(0, anchorIndex - 4);
  return messages
    .slice(startIndex, anchorIndex + 1)
    .map((message) => `${message.role === "user" ? "Usuario" : "GLOBAL"}: ${message.content}`)
    .join("\n");
}

function buildShortcutPayload(
  messages: Message[],
  anchorIndex: number,
  mode: ResponseMode,
): { displayMessage: string; requestMessage: string } {
  const anchorMessage = messages[anchorIndex];
  const originalQuestion = findRelatedUserMessage(messages, anchorIndex);
  const recentContext = buildRecentContext(messages, anchorIndex);
  const metadata = RESPONSE_MODE_METADATA[mode];

  const requestParts = [
    metadata.instruction,
    originalQuestion ? `Consulta original:\n${originalQuestion}` : "",
    anchorMessage?.content ? `Respuesta previa de GLOBAL:\n${anchorMessage.content}` : "",
    recentContext ? `Historial reciente:\n${recentContext}` : "",
  ].filter(Boolean);

  return {
    displayMessage: metadata.shortcutMessage,
    requestMessage: requestParts.join("\n\n"),
  };
}

export default function HomePage() {
  const [countries, setCountries] = useState<CountryDefinition[]>([]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [responseMode, setResponseMode] = useState<ResponseMode>("summary");
  const [externalCountry, setExternalCountry] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetStoredSession() {
    window.sessionStorage.removeItem("global-session");
    window.sessionStorage.removeItem("global-messages");
    setSession(null);
    setMessages([]);
    setResponseMode("summary");
  }

  useEffect(() => {
    async function bootstrap() {
      try {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
        const storedSession = window.sessionStorage.getItem("global-session");
        const storedMessages = window.sessionStorage.getItem("global-messages");

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as SessionState;
          try {
            const validatedSession = await fetchSession(parsedSession.session_id);
            setSession(validatedSession);
            setResponseMode(validatedSession.response_mode);
          } catch (sessionError) {
            if (sessionError instanceof ApiError && sessionError.status === 404) {
              window.sessionStorage.removeItem("global-session");
              window.sessionStorage.removeItem("global-messages");
            } else {
              throw sessionError;
            }
          }
        }

        if (storedMessages && window.sessionStorage.getItem("global-session")) {
          setMessages(JSON.parse(storedMessages) as Message[]);
        }
      } catch (bootError) {
        setError(
          bootError instanceof Error ? bootError.message : "No se pudo arrancar la app.",
        );
      } finally {
        setIsBooting(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (session) {
      window.sessionStorage.setItem("global-session", JSON.stringify(session));
    }
  }, [session]);

  useEffect(() => {
    window.sessionStorage.setItem("global-messages", JSON.stringify(messages));
  }, [messages]);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.id === session?.focus_country_id) ?? null,
    [countries, session?.focus_country_id],
  );

  const currentModeLabel = RESPONSE_MODE_METADATA[responseMode].label;
  const lastResponse = useMemo(() => getLastAssistantResponse(messages), [messages]);

  async function handleOnboarding(payload: {
    profile: OnboardingProfile;
    focusCountryId: string;
    wantsHousingAccessHelp: boolean;
  }) {
    setError(null);
    setIsSubmitting(true);

    try {
      const nextSession = await startSession({
        profile: payload.profile,
        focus_country_id: payload.focusCountryId,
        wants_housing_access_help: payload.wantsHousingAccessHelp,
      });

      setSession(nextSession);
      setResponseMode(nextSession.response_mode);
      setMessages([
        {
          role: "assistant",
          content:
            "Sesión creada. Ya puedes preguntar sobre leyes, ayudas, alquiler, compra, comparativas o simulaciones.",
        },
      ]);
    } catch (submissionError) {
      if (submissionError instanceof ApiError && submissionError.status === 404) {
        resetStoredSession();
        setError(
          "La sesión anterior ya no existe porque el backend se reinició. Crea una nueva sesión desde el onboarding.",
        );
        return;
      }

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo crear la sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitChatTurn(input: {
    displayMessage: string;
    requestMessage: string;
    nextMode: ResponseMode;
  }) {
    if (!session || !input.requestMessage.trim()) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input.displayMessage.trim(),
    };

    setError(null);
    setResponseMode(input.nextMode);
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setIsSubmitting(true);

    try {
      const response = await sendChatMessage({
        session_id: session.session_id,
        message: input.requestMessage.trim(),
        response_mode: input.nextMode,
        focus_country_id: session.focus_country_id,
        focus_country_label: externalCountry.trim() || undefined,
        include_web_fallback: true,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.answer,
          response,
        },
      ]);
      setSession((current) =>
        current
          ? {
              ...current,
              response_mode: response.response_mode,
            }
          : current,
      );
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo enviar la consulta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSend() {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return;
    }

    await submitChatTurn({
      displayMessage: trimmedQuestion,
      requestMessage: trimmedQuestion,
      nextMode: responseMode,
    });
  }

  async function handleShortcut(anchorIndex: number, mode: ResponseMode) {
    const payload = buildShortcutPayload(messages, anchorIndex, mode);
    await submitChatTurn({
      displayMessage: payload.displayMessage,
      requestMessage: payload.requestMessage,
      nextMode: mode,
    });
  }

  if (isBooting) {
    return <main className="global-main">Arrancando GLOBAL...</main>;
  }

  return (
    <main className="global-shell">
      <aside className="global-sidebar stack">
        <div>
          <div className="eyebrow">GLOBAL</div>
          <h1 className="title">Copiloto legislativo y habitacional</h1>
          <p className="muted">
            Chat único con RAG propio, datos estructurados, routing multi-IA y fallback web
            para responder tanto al MVP de cuatro países como a consultas externas.
          </p>
        </div>

        <section className="card meta-card stack">
          <strong>Ruta inteligente</strong>
          <div className="stack muted">
            <span>Groq: FAQ, resumen, clasificación y respuestas breves.</span>
            <span>Gemini: vivienda, ayudas, contratos y contexto largo.</span>
            <span>Mistral: análisis densos, simulación y fallback técnico.</span>
          </div>
        </section>

        {session ? (
          <section className="card meta-card stack">
            <strong>Sesión actual</strong>
            <div className="muted">Perfil: {session.profile}</div>
            <div className="muted">
              País foco interno: {selectedCountry?.label ?? session.focus_country_id}
            </div>
            <div className="muted">Modo activo: {currentModeLabel}</div>
            <label className="stack">
              <span>País externo opcional</span>
              <input
                className="textarea"
                style={{ minHeight: 0 }}
                placeholder="Ejemplo: Suecia"
                value={externalCountry}
                onChange={(event) => setExternalCountry(event.target.value)}
              />
            </label>
          </section>
        ) : null}
      </aside>

      <section className="global-main stack">
        {!session ? (
          <OnboardingForm
            countries={countries}
            onSubmit={handleOnboarding}
            loading={isSubmitting}
          />
        ) : (
          <>
            <section className="card" style={{ padding: 24 }}>
              <div
                className="cluster"
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <div className="eyebrow">Chat</div>
                  <h2 style={{ margin: "12px 0 4px" }}>
                    {selectedCountry?.label ?? "País externo"} como foco inicial
                  </h2>
                  <p className="muted">
                    Escribe tu pregunta y luego profundiza dentro del propio chat con los
                    atajos de resumen, detalle, datos o simulación.
                  </p>
                </div>
                <div className="cluster">
                  <span className="pill">Modo actual: {currentModeLabel}</span>
                </div>
              </div>

              <div className="message-list" style={{ marginTop: 20 }}>
                {messages.map((message, index) => (
                  <article
                    key={`${message.role}-${index}`}
                    className={`message ${
                      message.role === "user" ? "message-user" : "message-assistant"
                    }`}
                  >
                    {message.content}

                    {message.response ? (
                      <ChatShortcutBar
                        activeMode={message.response.response_mode}
                        disabled={isSubmitting}
                        onSelect={(mode) => handleShortcut(index, mode)}
                      />
                    ) : null}

                    {message.response?.cta ? (
                      <div className="cta-card" style={{ marginTop: 18 }}>
                        <strong>{message.response.cta.title}</strong>
                        <p style={{ margin: "8px 0" }}>
                          {message.response.cta.description}
                        </p>
                        <div>
                          <strong>{message.response.cta.action_label}</strong>
                          <div>{message.response.cta.next_step}</div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              <div className="input-bar">
                <div className="shortcut-helper">
                  Escribe una pregunta nueva o usa los atajos contextuales dentro del chat.
                </div>
                <textarea
                  className="textarea"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Escribe una ley, una duda, un escenario o un anuncio para analizar..."
                />
                <div className="cluster" style={{ justifyContent: "space-between" }}>
                  <span className="pill">La siguiente respuesta saldrá en modo {currentModeLabel}</span>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSend}
                  >
                    {isSubmitting ? "Consultando..." : "Enviar"}
                  </button>
                </div>
              </div>
            </section>

            {lastResponse ? (
              <div className="meta-grid">
                <section className="card meta-card stack">
                  <div className="eyebrow">Routing</div>
                  <div className="muted">Proveedor usado: {lastResponse.provider_used}</div>
                  <div className="muted">Intento: {lastResponse.route.intent}</div>
                  <div className="muted">
                    Cadena: {lastResponse.route.attempted_providers.join(" -> ")}
                  </div>
                  <div className="muted">
                    Señales: RAG {String(lastResponse.route.used_rag)} · DuckDB{" "}
                    {String(lastResponse.route.used_duckdb)} · Web{" "}
                    {String(lastResponse.route.used_web)}
                  </div>
                </section>

                <SourcesPanel sources={lastResponse.sources} />
              </div>
            ) : null}

            {lastResponse?.chart ? <MiniChart chart={lastResponse.chart} /> : null}
          </>
        )}

        {error ? (
          <section
            className="card meta-card"
            style={{ borderColor: "rgba(123,61,43,0.35)" }}
          >
            <strong style={{ color: "var(--danger)" }}>Error</strong>
            <p className="muted">{error}</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
