"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { TaskForm } from "../form/task-form";

export function CreateTaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  // Trocar a key remonta o TaskForm vazio: é a forma do React de zerar o estado.
  const [formKey, setFormKey] = useState(0);

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        // Marca a listagem como desatualizada para ela mostrar a tarefa nova.
        // pathFilter pega todas as páginas da infinite query de uma vez.
        await queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
        toast.success("Tarefa criada! A colmeia agradece.");
        setFormKey((key) => key + 1);
        router.push("/");
      },
    }),
  );

  return (
    <TaskForm
      key={formKey}
      submitLabel="Criar tarefa"
      pendingLabel="Criando..."
      errorMessage="Não foi possível criar a tarefa. Tente novamente."
      onSubmit={(values) => createTask.mutateAsync(values)}
    />
  );
}
