import type { ReactNode } from "react";

type AlertProps = {
  title: string;
  description?: string;
  /** Como se recuperar do erro, normalmente um <Button> "Tentar novamente". */
  action?: ReactNode;
};

// Painel de erro que ocupa o lugar do conteúdo que falhou (ex.: a listagem).
// role="alert" faz o leitor de tela anunciar o erro assim que ele aparece.
// Para avisos passageiros, como o resultado de uma ação, use toast.error().
export function Alert({ title, description, action }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-panel border border-danger-border bg-danger-soft p-6"
    >
      <div className="flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
          <circle cx="12" cy="12" r="9" fill="none" stroke="var(--color-danger)" strokeWidth="2" />
          <path
            d="M12 7.5v5.5M12 16.5v.01"
            fill="none"
            stroke="var(--color-danger)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h2 className="text-lead font-bold text-danger-ink">{title}</h2>
      </div>
      {description && (
        <p className="text-body leading-normal text-danger-ink-soft">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
