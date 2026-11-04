"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

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
        {loading && <Loading label="Carregando mais tarefas..." />}
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
