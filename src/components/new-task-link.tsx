"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// No design, o botão "Nova tarefa" do cabeçalho só aparece na listagem; nas
// páginas de criar e editar ele não faz sentido. Ler a rota exige um Client
// Component, então só este pedaço do cabeçalho roda no cliente.
export function NewTaskLink() {
  const pathname = usePathname();
  if (pathname !== "/") return null;

  return (
    <Link
      href="/tasks/new"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-honey-strong bg-honey px-[18px] text-body font-bold text-ink transition-colors hover:bg-honey-strong"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      Nova tarefa
    </Link>
  );
}
