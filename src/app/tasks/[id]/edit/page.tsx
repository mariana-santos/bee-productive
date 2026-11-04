import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { EditTaskForm } from "@/features/tasks/components/edit/edit-task-form";
import { EditTaskSkeleton } from "@/features/tasks/components/edit/edit-task-skeleton";
import { TaskFormLayout } from "@/features/tasks/components/form/task-form-layout";
import { formatDate } from "@/features/tasks/format";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata: Metadata = { title: "Editar tarefa" };

export default function EditTask({ params }: PageProps<"/tasks/[id]/edit">) {
  return (
    // `params` só é lido dentro do Suspense: assim o skeleton vai no shell e a
    // tarefa chega por streaming.
    <Suspense
      fallback={
        <TaskFormLayout title="Editar tarefa">
          <EditTaskSkeleton />
        </TaskFormLayout>
      }
    >
      <EditTaskContent params={params} />
    </Suspense>
  );
}

async function EditTaskContent({ params }: Pick<PageProps<"/tasks/[id]/edit">, "params">) {
  // Store em memória é síncrono: connection() garante a leitura a cada request.
  await connection();
  const { id } = await params;
  const task = await getTask(id);

  return (
    <TaskFormLayout
      title="Editar tarefa"
      description={
        <>
          Criada em{" "}
          <time dateTime={task.createdAt.toISOString()}>{formatDate(task.createdAt)}</time>
        </>
      }
    >
      {/* A key remonta o form quando a tarefa muda no servidor: o Next guarda o
          estado de páginas visitadas, e sem isso o form mostraria valores antigos. */}
      <EditTaskForm key={`${task.title}\n${task.description ?? ""}`} task={task} />
    </TaskFormLayout>
  );
}

async function getTask(id: string) {
  try {
    return await getQueryClient().fetchQuery(trpc.tasks.getById.queryOptions({ id }));
  } catch (error) {
    // O procedure lança NOT_FOUND para id inexistente: vira o not-found.tsx da rota.
    if (error instanceof TRPCError && error.code === "NOT_FOUND") notFound();
    throw error;
  }
}
