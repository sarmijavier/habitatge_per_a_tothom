import type { ResponseMode } from "../lib/types";

const RESPONSE_MODE_OPTIONS: { id: ResponseMode; label: string }[] = [
  { id: "summary", label: "Resumen" },
  { id: "detail", label: "Más detalle" },
  { id: "data", label: "Ver datos" },
  { id: "simulate", label: "Simular" },
];

type ChatShortcutBarProps = {
  activeMode: ResponseMode;
  disabled?: boolean;
  onSelect: (mode: ResponseMode) => void;
};

export function ChatShortcutBar({
  activeMode,
  disabled = false,
  onSelect,
}: ChatShortcutBarProps) {
  return (
    <div className="shortcut-bar">
      <div className="shortcut-helper">
        Atajos contextuales sobre esta conversación:
      </div>
      <div className="shortcut-actions">
        {RESPONSE_MODE_OPTIONS.map((option) => (
          <button
            key={option.id}
            className="secondary-button shortcut-button"
            data-active={activeMode === option.id}
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
