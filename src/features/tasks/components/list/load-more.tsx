"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

type LoadMoreProps = {
  hasNextPage: boolean;
  /** Buscando a próxima página. */
  loading: boolean;
  /** A próxima página falhou; as tarefas já carregadas continuam na tela. */
  error: boolean;
  onLoadMore: () => void;
};

/**
 * Fim da lista do scroll infinito: um sentinel invisível que pede a próxima
 * página quando entra na tela, e o rodapé com o carregamento ou o erro.
 */
export function LoadMore({ hasNextPage, loading, error, onLoadMore }: LoadMoreProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Guardamos o callback num ref para o observer não depender dele.
  const onLoadMoreRef = useRef(onLoadMore);
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  });

  const shouldObserve = hasNextPage && !loading && !error;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!shouldObserve || !sentinel) return;
    // IntersectionObserver em vez de ouvir o scroll: o navegador avisa só quando
    // o sentinel chega perto da tela (rootMargin), sem cálculo a cada pixel.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMoreRef.current();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
    // O observer sai durante o carregamento e volta depois. Ao voltar, ele avisa de
    // novo se o sentinel continuar visível (lista curta numa tela alta), e o scroll não trava.
  }, [shouldObserve]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      {/* role="status" anuncia o carregamento e o erro para leitores de tela. */}
      <div role="status" className="flex flex-col items-center gap-3 pt-7 text-sm text-ink-muted">
        {loading && (
          <span className="flex items-center gap-2.5">
            <LoadingHives />
            Carregando mais tarefas...
          </span>
        )}
        {error && (
          <>
            <span>Não foi possível carregar mais tarefas.</span>
            <Button variant="secondary" onClick={onLoadMore}>
              Tentar novamente
            </Button>
          </>
        )}
      </div>
    </>
  );
}

// Três favos esmaecendo, como no rodapé do design.
function LoadingHives() {
  return (
    <svg width="44" height="14" viewBox="0 0 66 22" aria-hidden="true">
      <polygon points="11,1 20,6 20,16 11,21 2,16 2,6" fill="var(--color-honey)" />
      <polygon points="33,1 42,6 42,16 33,21 24,16 24,6" fill="var(--color-honey)" opacity="0.6" />
      <polygon points="55,1 64,6 64,16 55,21 46,16 46,6" fill="var(--color-honey)" opacity="0.3" />
    </svg>
  );
}
