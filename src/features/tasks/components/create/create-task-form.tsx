"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { createTaskSchema } from "@/server/tasks/schema";
import { useTRPC } from "@/trpc/client";

type FieldErrors = { title?: string; description?: string };

export function CreateTaskForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: async () => {
        // Marca a listagem como desatualizada para ela mostrar a tarefa nova.
        // pathFilter pega todas as páginas da infinite query de uma vez.
        await queryClient.invalidateQueries(trpc.tasks.list.pathFilter());
        toast.success("Tarefa criada! A colmeia agradece.");
        router.push("/");
      },
    }),
  );

  function showErrors(next: FieldErrors) {
    setErrors(next);
    // Leva o foco ao primeiro campo com erro, para quem usa teclado ou leitor de tela.
    if (next.title) titleRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Mesmo schema do servidor: as regras e mensagens vivem num lugar só, e o
    // erro aparece na hora, sem ida ao servidor.
    const result = createTaskSchema.safeParse({ title, description });
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      showErrors({ title: fieldErrors.title?.[0], description: fieldErrors.description?.[0] });
      return;
    }
    setErrors({});
    createTask.mutate(result.data, {
      onError: (error) => {
        // Se a validação do servidor recusar algo que passou no cliente, as
        // mensagens do Zod (ver errorFormatter) voltam para os campos certos.
        // O errorFormatter é genérico (vale para qualquer procedure), então o tipo
        // dos campos é informado aqui.
        const serverErrors = error.data?.zodError?.fieldErrors as
          Partial<Record<keyof FieldErrors, string[]>> | undefined;
        if (serverErrors) {
          showErrors({
            title: serverErrors.title?.[0],
            description: serverErrors.description?.[0],
          });
        }
      },
    });
  }

  const pending = createTask.isPending;
  // Erro que não é de validação (rede, servidor fora): aviso geral no topo do form.
  const serverError = createTask.isError && !createTask.error.data?.zodError;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[22px] rounded-panel border border-line bg-surface p-7"
    >
      {serverError && <Alert title="Não foi possível criar a tarefa. Tente novamente." />}

      <Field
        ref={titleRef}
        label="Título"
        required
        placeholder="Ex: Revisar o README"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          // O erro some assim que a pessoa começa a corrigir.
          if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
        }}
        error={errors.title}
        disabled={pending}
      />

      <Field
        label="Descrição"
        multiline
        rows={5}
        placeholder="Detalhes, links, o que precisar."
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          if (errors.description) setErrors((current) => ({ ...current, description: undefined }));
        }}
        error={errors.description}
        disabled={pending}
      />

      <div className="flex flex-wrap justify-end gap-2.5">
        <Button variant="secondary" href="/">
          Cancelar
        </Button>
        <Button type="submit" loading={pending && "Criando..."}>
          Criar tarefa
        </Button>
      </div>
    </form>
  );
}
