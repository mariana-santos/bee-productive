import { Toaster as SonnerToaster } from "sonner";

// Toasts no visual do design: claros, mel para sucesso e vermelho suave para erro.
// `unstyled` desliga o visual padrão do Sonner (mantendo posição, empilhamento,
// animação e swipe) para estilizarmos só com os tokens do Tailwind.
//
// Uso, de qualquer Client Component:
//   toast.success("Tarefa criada! A colmeia agradece.")
//   toast.error("Tarefa não encontrada.", { action: { label: "Tentar novamente", onClick } })
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      icons={{ success: <SuccessIcon />, error: <ErrorIcon /> }}
      toastOptions={{
        unstyled: true,
        classNames: {
          // `group` deixa a cor do botão de ação seguir o tipo (data-type) do toast.
          toast:
            "group flex w-full items-center gap-2.5 rounded-toast border px-4 py-3 text-sm font-medium shadow-sm font-sans",
          success: "border-honey-soft-border bg-honey-soft text-ink",
          error: "border-danger-border bg-danger-soft text-danger-ink",
          icon: "flex flex-none",
          content: "flex-1",
          actionButton:
            "min-h-9 flex-none cursor-pointer rounded-full border bg-surface px-3.5 text-caption font-bold transition-colors border-honey-soft-border hover:bg-honey-soft group-data-[type=error]:border-danger-border group-data-[type=error]:hover:bg-danger-soft",
        },
      }}
    />
  );
}

// Mesmos ícones do design: o favo com check e o círculo de alerta.
function SuccessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="var(--color-honey)" />
      <path
        d="M8.5 12.2l2.4 2.4 4.6-4.8"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="var(--color-danger)" />
      <path
        d="M12 7.5v5.5M12 16.5v.01"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
