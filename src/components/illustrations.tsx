// Ilustrações dos estados vazios: o favo do logo, tracejado (sem tarefa dentro).
// Decorativas (aria-hidden): o título do EmptyState já explica o estado.

/** Colmeia vazia, para a listagem sem tarefas. */
export function EmptyHive({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <HiveOutline />
      <circle cx="16.8" cy="7.6" r="1.6" fill="var(--color-honey)" />
    </svg>
  );
}

/** Favo com interrogação, para tarefa não encontrada. */
export function LostHive({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <HiveOutline />
      <path
        d="M10 9.5a2 2 0 1 1 2.8 1.8c-.6.3-.8.7-.8 1.3v.4M12 15.5v.01"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HiveOutline() {
  return (
    <polygon
      points="12,2 21,7 21,17 12,22 3,17 3,7"
      fill="var(--color-honey-soft)"
      stroke="var(--color-honey-strong)"
      strokeWidth="0.8"
      strokeDasharray="1.6 1.2"
      strokeLinejoin="round"
    />
  );
}
