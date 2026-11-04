import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/header";

type TaskFormLayoutProps = {
  title: string;
  /** Linha abaixo do título (ex.: "Criada em ..." na edição). */
  description?: ReactNode;
  children: ReactNode;
};

// Moldura comum das telas de criar e editar: header, "Voltar para tarefas",
// título e a coluna estreita (640px) do formulário.
export function TaskFormLayout({ title, description, children }: TaskFormLayoutProps) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-form px-6 pt-8 pb-16">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-muted no-underline hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voltar para tarefas
        </Link>
        <h1 className="mt-2 font-display text-title-lg leading-tight font-semibold">{title}</h1>
        {description && <p className="mt-2 text-base text-ink-muted">{description}</p>}
        <div className="mt-6">{children}</div>
      </main>
    </>
  );
}
