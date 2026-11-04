"use client";

import { TRPCClientError } from "@trpc/client";
import { useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { createTaskSchema, type CreateTaskInput } from "@/server/tasks/schema";

type FieldErrors = { title?: string; description?: string };

type TaskFormProps = {
  /** Valores iniciais (na edição, os da tarefa). Também são o destino do "Cancelar". */
  defaultValues?: { title: string; description: string };
  submitLabel: string;
  pendingLabel: string;
  /** Aviso no topo do form quando o envio falha por algo que não é validação. */
  errorMessage: string;
  /** Envia os dados já validados. Deve rejeitar (ex.: mutateAsync) se o servidor falhar. */
  onSubmit: (values: CreateTaskInput) => Promise<unknown>;
};

const emptyValues = { title: "", description: "" };

/**
 * Campos, validação e estados de envio comuns a criar e editar. Quem usa só
 * decide o que fazer com os dados (qual mutation, toast e para onde navegar).
 */
export function TaskForm({
  defaultValues = emptyValues,
  submitLabel,
  pendingLabel,
  errorMessage,
  onSubmit,
}: TaskFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "error">("idle");

  function showErrors(next: FieldErrors) {
    setErrors(next);
    // Leva o foco ao primeiro campo com erro, para quem usa teclado ou leitor de tela.
    if (next.title) titleRef.current?.focus();
  }

  // Com Cache Components, o Next guarda o estado de páginas já visitadas
  // (via <Activity>): sem limpar, o form reapareceria com o rascunho ao voltar.
  function reset() {
    setTitle(defaultValues.title);
    setDescription(defaultValues.description);
    setErrors({});
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    setStatus("pending");
    try {
      await onSubmit(result.data);
      setStatus("idle");
    } catch (error) {
      // Se a validação do servidor recusar algo que passou no cliente, as
      // mensagens do Zod (ver errorFormatter) voltam para os campos certos.
      // O errorFormatter é genérico (vale para qualquer procedure), então o tipo
      // dos campos é informado aqui.
      const serverErrors =
        error instanceof TRPCClientError
          ? (error.data?.zodError?.fieldErrors as Partial<Record<keyof FieldErrors, string[]>>)
          : undefined;
      if (serverErrors) {
        showErrors({ title: serverErrors.title?.[0], description: serverErrors.description?.[0] });
        setStatus("idle");
      } else {
        // Rede, servidor fora: aviso geral no topo, mantendo o que foi digitado.
        setStatus("error");
      }
    }
  }

  const pending = status === "pending";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[22px] rounded-panel border border-line bg-surface p-7"
    >
      {status === "error" && <Alert title={errorMessage} />}

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
        <Button variant="secondary" href="/" onClick={reset}>
          Cancelar
        </Button>
        <Button type="submit" loading={pending && pendingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
