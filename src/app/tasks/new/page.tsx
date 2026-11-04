import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { CreateTaskForm } from "@/features/tasks/components/create/create-task-form";

export const metadata: Metadata = { title: "Nova tarefa" };

export default function NewTask() {
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
        <h1 className="mt-2 font-display text-title-lg leading-tight font-semibold">Nova tarefa</h1>
        <p className="mt-2 mb-6 text-base text-ink-muted">
          Só o título é obrigatório. O resto é mel extra.
        </p>
        <CreateTaskForm />
      </main>
    </>
  );
}
