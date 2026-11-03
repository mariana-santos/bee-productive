"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Botões que disparam os toasts do design (toast() só roda no cliente).
export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast.success("Tarefa criada! A colmeia agradece.")}
      >
        Sucesso
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Tarefa não encontrada. Ela pode já ter sido excluída.")}
      >
        Erro
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Não foi possível excluir a tarefa.", {
            action: { label: "Tentar novamente", onClick: () => toast.success("Tarefa excluída.") },
          })
        }
      >
        Erro com ação
      </Button>
    </div>
  );
}
