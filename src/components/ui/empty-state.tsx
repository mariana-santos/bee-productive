import type { ReactNode } from "react";

type EmptyStateProps = {
  /** Ilustração decorativa (ex.: <EmptyHive />). */
  icon: ReactNode;
  title: string;
  description: string;
  /** Próximo passo para a pessoa, normalmente um <Button>. */
  action?: ReactNode;
};

// Painel centralizado para quando não há o que mostrar: listagem vazia, tarefa
// não encontrada. O texto e a ação vêm de quem usa; aqui só fica o layout.
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3.5 rounded-panel border border-line bg-surface p-8 text-center">
      {icon}
      <h2 className="font-display text-title-sm leading-tight font-semibold">{title}</h2>
      <p className="max-w-sm text-body leading-normal text-ink-muted">{description}</p>
      {action}
    </div>
  );
}
