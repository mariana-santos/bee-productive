import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

// Placeholder: a listagem de tarefas substitui o conteúdo do <main> na próxima etapa.
export default function Home() {
  return (
    <>
      <Header
        action={
          <Button href="/tasks/new">
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
          </Button>
        }
      />
      <main className="mx-auto w-full max-w-page px-6 pt-10 pb-16">
        <h1 className="font-display text-display leading-tight font-semibold">Suas tarefas</h1>
      </main>
    </>
  );
}
