import { Button } from "@/components/ui/button";
import type { Task } from "@/server/tasks/schema";
import { DeleteTaskButton } from "./delete-task-button";

// Fuso fixo: o SSR roda no fuso do servidor e o navegador no da pessoa; sem
// isso, a hora do HTML e a da hidratação podem diferir e o React acusa mismatch.
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function TaskItem({ task }: { task: Task }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-4 rounded-card border border-line bg-surface px-[22px] py-5">
      <div className="flex min-w-0 flex-[1_1_320px] gap-3">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-[5px] flex-none"
        >
          <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="var(--color-honey)" />
        </svg>
        <div className="min-w-0">
          {/* break-words: títulos e descrições longos sem espaço não estouram o card. */}
          <h2 className="text-lead font-bold break-words">{task.title}</h2>
          {task.description && (
            <p className="mt-1.5 text-body leading-normal break-words whitespace-pre-line text-ink-muted">
              {task.description}
            </p>
          )}
          <p className="mt-2.5 text-caption text-ink-subtle">
            Criada em{" "}
            <time dateTime={task.createdAt.toISOString()}>{dateFormat.format(task.createdAt)}</time>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* aria-label com o título: "Editar" repetido em toda a lista não diz qual tarefa. */}
        <Button
          variant="secondary"
          href={`/tasks/${task.id}/edit`}
          aria-label={`Editar ${task.title}`}
        >
          Editar
        </Button>
        <DeleteTaskButton task={task} />
      </div>
    </li>
  );
}
