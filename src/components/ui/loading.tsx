/**
 * Indicador de carregamento em linha: três favos esmaecendo + um texto.
 * Para carregamentos curtos de algo que já está na tela (ex.: próxima página);
 * quando o conteúdo ainda não existe, prefira o Skeleton no formato dele.
 */
export function Loading({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2.5 text-sm text-ink-muted">
      <svg
        width="44"
        height="14"
        viewBox="0 0 66 22"
        aria-hidden="true"
        className="animate-pulse motion-reduce:animate-none"
      >
        <polygon points="11,1 20,6 20,16 11,21 2,16 2,6" fill="var(--color-honey)" />
        <polygon
          points="33,1 42,6 42,16 33,21 24,16 24,6"
          fill="var(--color-honey)"
          opacity="0.6"
        />
        <polygon
          points="55,1 64,6 64,16 55,21 46,16 46,6"
          fill="var(--color-honey)"
          opacity="0.3"
        />
      </svg>
      {label}
    </span>
  );
}
