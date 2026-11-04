import { Header } from "@/components/header";
import { LostHive } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/** Tela de edição quando o id não existe (excluída ou link errado). */
export function TaskNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-form px-6 pt-10 pb-16">
        <EmptyState
          icon={<LostHive />}
          title="Essa tarefa voou para longe"
          description="Ela pode ter sido excluída ou o link está incorreto."
          action={
            <Button variant="secondary" href="/">
              Voltar para tarefas
            </Button>
          }
        />
      </main>
    </>
  );
}
