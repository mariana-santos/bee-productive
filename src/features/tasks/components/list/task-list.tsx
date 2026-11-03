"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { taskListInput, taskListOptions } from "../../list-query";
import { LoadMore } from "./load-more";
import { TaskListEmpty } from "./task-list-empty";
import { TaskListSkeleton } from "./task-list-skeleton";

// Só a busca dos dados e a escolha do estado ficam aqui;
export function TaskList() {
  const trpc = useTRPC();
  const {
    data,
    status,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery(trpc.tasks.list.infiniteQueryOptions(taskListInput, taskListOptions));

  if (status === "pending") return <TaskListSkeleton />;

  // Erro sem nenhum dado: falhou a primeira página. Se falhar uma página seguinte,
  // o status também vira "error", mas com `data`: as tarefas já carregadas
  // continuam na tela e o erro aparece só no rodapé.
  if (!data) {
    return (
      <Alert
        title="Não foi possível carregar as tarefas"
        description="Verifique sua conexão e tente novamente."
        action={
          <Button variant="danger" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  const tasks = data.pages.flatMap((page) => page.items);
  if (tasks.length === 0) return <TaskListEmpty />;

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          // Provisório: o TaskCard (título, descrição, data e ações) entra aqui.
          <li key={task.id} className="rounded-card border border-line bg-surface px-[22px] py-5">
            <h2 className="text-lead font-bold">{task.title}</h2>
          </li>
        ))}
      </ul>

      <LoadMore
        hasNextPage={hasNextPage}
        loading={isFetchingNextPage}
        error={isFetchNextPageError}
        onLoadMore={() => fetchNextPage()}
      />
    </div>
  );
}
