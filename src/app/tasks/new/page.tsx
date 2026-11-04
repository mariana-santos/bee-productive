import type { Metadata } from "next";
import { CreateTaskForm } from "@/features/tasks/components/create/create-task-form";
import { TaskFormLayout } from "@/features/tasks/components/form/task-form-layout";

export const metadata: Metadata = { title: "Nova tarefa" };

export default function NewTask() {
  return (
    <TaskFormLayout
      title="Nova tarefa"
      description="Só o título é obrigatório. O resto é mel extra."
    >
      <CreateTaskForm />
    </TaskFormLayout>
  );
}
