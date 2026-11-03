import { EmptyHive } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export function TaskListEmpty() {
  return (
    <EmptyState
      icon={<EmptyHive />}
      title="A colmeia está vazia"
      description="Crie sua primeira tarefa para começar a produzir mel."
      action={<Button href="/tasks/new">Nova tarefa</Button>}
    />
  );
}
