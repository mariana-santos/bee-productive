type SkeletonProps = {
  /** Tom mais claro do design: o forte marca títulos e labels; o claro, textos e campos. */
  soft?: boolean;
  /** Cantos de campo (10px) em vez de pílula, para imitar inputs e textareas. */
  block?: boolean;
  /** Tamanho da barra, ex.: "h-3.5 w-3/5". */
  className?: string;
};

/**
 * Barra de placeholder enquanto o conteúdo carrega. Quem usa monta o layout
 * com várias barras e define o tamanho de cada uma, imitando o que vai aparecer.
 */
export function Skeleton({ soft = false, block = false, className }: SkeletonProps) {
  return (
    <div
      // Decorativo: quem monta o skeleton marca aria-busy e um texto de carregando.
      aria-hidden="true"
      className={[
        "animate-pulse motion-reduce:animate-none",
        soft ? "bg-skeleton-soft" : "bg-skeleton",
        block ? "rounded-field" : "rounded-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
