import { connection } from "next/server";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { TaskList } from "@/features/tasks/components/list/task-list";
import { TaskListSkeleton } from "@/features/tasks/components/list/task-list-skeleton";
import { taskListInput, taskListOptions } from "@/features/tasks/list-query";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

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
        <h1 className="mb-5 font-display text-display leading-tight font-semibold">Suas tarefas</h1>
        {/* Cabeçalho e título vão no shell estático; a lista chega por streaming. */}
        <Suspense fallback={<TaskListSkeleton />}>
          <PrefetchedTaskList />
        </Suspense>
      </main>
    </>
  );
}

async function PrefetchedTaskList() {
  // O store em memória é síncrono: sem connection(), o Next leria as tarefas no
  // build e congelaria a lista. Assim a leitura acontece a cada request.
  await connection();
  // `await` (e não só disparar o prefetch) para a primeira página já vir no HTML
  // do servidor: é o SSR da listagem. O store responde na hora, então não atrasa.
  await getQueryClient().prefetchInfiniteQuery(
    trpc.tasks.list.infiniteQueryOptions(taskListInput, taskListOptions),
  );

  return (
    <HydrateClient>
      <TaskList />
    </HydrateClient>
  );
}
