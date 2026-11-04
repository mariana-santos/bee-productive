"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Task } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";
import { taskListInput } from "../../list-query";

export function DeleteTaskButton({ task }: { task: Task }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const listKey = trpc.tasks.list.infiniteQueryKey(taskListInput);

  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: ({ id }) => {
        // Tira o card da tela na hora, sem esperar o refetch de todas as páginas.
        queryClient.setQueryData(
          listKey,
          (data) =>
            data && {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== id),
              })),
            },
        );
        // Depois sincroniza com o servidor: a paginação por offset muda quando um
        // item sai, e o refetch corrige os cursores das páginas seguintes.
        void queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
        toast.success("Tarefa excluída. Uma a menos na colmeia!");
      },
      onError: (error) => {
        if (error.data?.code === "NOT_FOUND") {
          // Outra aba (ou pessoa) já excluiu: atualiza a lista para o card sumir.
          void queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
          toast.error("Tarefa não encontrada. Ela pode já ter sido excluída.");
          return;
        }
        toast.error("Não foi possível excluir a tarefa.", {
          action: { label: "Tentar novamente", onClick: () => deleteTask.mutate({ id: task.id }) },
        });
      },
    }),
  );

  return (
    <Button
      variant="danger"
      loading={deleteTask.isPending && "Excluindo..."}
      aria-label={`Excluir ${task.title}`}
      onClick={() => deleteTask.mutate({ id: task.id })}
    >
      Excluir
    </Button>
  );
}
