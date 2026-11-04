import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

// A ação do lado direito (ex.: botão "Nova tarefa" na listagem) vem de quem usa
// o Header. Assim ele continua genérico e Server Component, sem precisar ler a
// rota no cliente para decidir o que mostrar.
//
// Fixo no topo com `sticky` (não `fixed`): continua ocupando espaço no fluxo,
// então o conteúdo não precisa de padding extra. O fundo é opaco para o
// conteúdo não aparecer por trás durante o scroll.
export function Header({ action }: { action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-ink no-underline">
          <Logo />
        </Link>
        {action}
      </div>
    </header>
  );
}
