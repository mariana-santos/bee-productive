"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Task } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";
import { TaskForm } from "../form/task-form";

export function EditTaskForm({ task }: { task: Task }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
        toast.success("Alterações salvas.");
        router.push("/");
      },
    }),
  );

  return (
    <TaskForm
      defaultValues={{ title: task.title, description: task.description ?? "" }}
      submitLabel="Salvar alterações"
      pendingLabel="Salvando..."
      errorMessage="Não foi possível salvar as alterações. Tente novamente."
      // Descrição vazia também vai: é como a pessoa apaga a descrição.
      onSubmit={(values) =>
        updateTask.mutateAsync({ id: task.id, ...values, description: values.description ?? "" })
      }
    />
  );
}
