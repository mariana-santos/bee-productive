import { Skeleton } from "@/components/ui/skeleton";

/**
 * Cards de placeholder enquanto a primeira página carrega.
 * A página usa como fallback do <Suspense> direto no servidor.
 */
export function TaskListSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <span className="sr-only">Carregando tarefas...</span>
      {["w-3/5", "w-[45%]", "w-[55%]"].map((titleWidth) => (
        <div
          key={titleWidth}
          className="flex flex-col gap-2.5 rounded-card border border-line bg-surface p-5"
        >
          <Skeleton className={`h-3.5 ${titleWidth}`} />
          <Skeleton soft className="h-2.5 w-4/5" />
          <Skeleton soft className="h-2.5 w-[35%]" />
        </div>
      ))}
    </div>
  );
}
