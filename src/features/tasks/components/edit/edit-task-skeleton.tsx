import { Skeleton } from "@/components/ui/skeleton";

/** O formulário de edição enquanto a tarefa carrega (estado "Carregando" do design). */
export function EditTaskSkeleton() {
  return (
    <div
      aria-busy="true"
      className="flex flex-col gap-3.5 rounded-panel border border-line bg-surface p-7"
    >
      <span className="sr-only">Carregando tarefa...</span>
      <Skeleton className="h-3 w-[30%]" />
      <Skeleton soft block className="h-12" />
      <Skeleton className="h-3 w-[40%]" />
      <Skeleton soft block className="h-36" />
      <Skeleton soft className="h-11 w-40 self-end" />
    </div>
  );
}
