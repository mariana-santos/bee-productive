import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export const metadata: Metadata = { title: "Design system" };

// Vitrine dos componentes e estilos
export default function DesignSystem() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-page flex-col gap-12 px-6 pt-10 pb-16">
        <h1 className="font-display text-display leading-tight font-semibold">Design system</h1>

        <Section title="Logo">
          <Logo />
        </Section>

        <Section title="Header">
          <div className="overflow-hidden rounded-card border border-line">
            <Header />
          </div>
          <div className="overflow-hidden rounded-card border border-line">
            <Header action={<Button href="/tasks/new">Nova tarefa</Button>} />
          </div>
        </Section>

        <Section title="Button">
          <div className="flex flex-wrap gap-3">
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="danger">Excluir</Button>
            <Button variant="danger" loading="Excluindo...">
              Excluir
            </Button>
            <Button variant="secondary" href="/">
              Link com cara de botão
            </Button>
          </div>
        </Section>

        <Section title="Field">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Título" required placeholder="Ex: Revisar o README" />
            <Field
              label="Título"
              required
              placeholder="Ex: Revisar o README"
              error="O título é obrigatório."
            />
            <Field
              label="Descrição"
              multiline
              rows={5}
              placeholder="Detalhes, links, o que precisar."
            />
            <Field label="Título" required defaultValue="Planejar a sprint" disabled />
          </div>
        </Section>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-caption font-bold tracking-[0.08em] text-ink-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}
