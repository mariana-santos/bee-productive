import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { EmptyHive, LostHive } from "@/components/illustrations";
import { Logo, LogoMark } from "@/components/logo";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Loading } from "@/components/ui/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastDemo } from "./toast-demo";

export const metadata: Metadata = { title: "Design system" };

// Vitrine dos componentes e estilos
export default function DesignSystem() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-page flex-col gap-12 px-6 pt-10 pb-16">
        <h1 className="font-display text-display leading-tight font-semibold">Design system</h1>

        <Section title="Identidade visual">
          <div className="flex items-center gap-4">
            <LogoMark size={72} />
            <div>
              <p className="font-display text-display leading-none font-semibold">Bee Productive</p>
              <p className="mt-2 text-body text-ink-muted">
                Um favo, um check. Tarefas feitas, colmeia feliz.
              </p>
            </div>
          </div>
          <Logo />
        </Section>

        <Section title="Cores">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colors.map((color) => (
              <li key={color.name} className="flex flex-col gap-1.5">
                <div className={`h-16 rounded-toast border border-line ${color.className}`} />
                <p className="text-sm font-bold">{color.name}</p>
                <p className="text-caption text-ink-muted">
                  {color.hex} · {color.use}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Tipografia">
          <p className="font-display text-title-lg leading-tight font-semibold">
            Bricolage Grotesque 600 para títulos
          </p>
          <p className="text-lead leading-normal">
            DM Sans 400 / 500 / 700 para texto, labels e botões. Corpo em 15 a 17px.
          </p>
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

        <Section title="Skeleton">
          <div className="grid items-start gap-6 sm:grid-cols-2">
            {/* Card da listagem carregando */}
            <div
              aria-busy="true"
              className="flex flex-col gap-2.5 rounded-card border border-line bg-surface p-5"
            >
              <span className="sr-only">Carregando tarefa...</span>
              <Skeleton className="h-3.5 w-3/5" />
              <Skeleton soft className="h-2.5 w-[90%]" />
              <Skeleton soft className="h-2.5 w-[35%]" />
            </div>
            {/* Formulário de edição carregando */}
            <div
              aria-busy="true"
              className="flex flex-col gap-3.5 rounded-panel border border-line bg-surface p-5"
            >
              <span className="sr-only">Carregando formulário...</span>
              <Skeleton className="h-3 w-[30%]" />
              <Skeleton soft block className="h-11" />
              <Skeleton className="h-3 w-[40%]" />
              <Skeleton soft block className="h-24" />
              <Skeleton soft className="h-11 w-36 self-end" />
            </div>
          </div>
        </Section>

        <Section title="Loading">
          <Loading label="Carregando mais tarefas..." />
        </Section>

        <Section title="Alert">
          <Alert
            title="Não foi possível carregar as tarefas"
            description="Verifique sua conexão e tente novamente."
            action={<Button variant="danger">Tentar novamente</Button>}
          />
        </Section>

        <Section title="Toast">
          <ToastDemo />
        </Section>

        <Section title="EmptyState">
          <div className="grid gap-6 sm:grid-cols-2">
            <EmptyState
              icon={<EmptyHive />}
              title="A colmeia está vazia"
              description="Crie sua primeira tarefa para começar a produzir mel."
              action={<Button href="/tasks/new">Nova tarefa</Button>}
            />
            <EmptyState
              icon={<LostHive />}
              title="Essa tarefa voou para longe"
              description="Ela pode ter sido excluída ou o link está incorreto."
              action={
                <Button variant="secondary" href="/">
                  Voltar para tarefas
                </Button>
              }
            />
          </div>
        </Section>
      </main>
    </>
  );
}

// Paleta do design. As classes ficam escritas por extenso para o Tailwind
// encontrá-las no código (ele não gera classes montadas em tempo de execução).
const colors = [
  { name: "Mel", hex: "#F5C02E", use: "ação principal", className: "bg-honey" },
  { name: "Mel claro", hex: "#FDF0C2", use: "destaques", className: "bg-honey-soft" },
  { name: "Marfim", hex: "#FAF9F5", use: "fundo", className: "bg-canvas" },
  { name: "Branco", hex: "#FFFFFF", use: "cards", className: "bg-surface" },
  { name: "Grafite", hex: "#2B2A27", use: "texto", className: "bg-ink" },
  { name: "Cinza", hex: "#5E5D59", use: "texto secundário", className: "bg-ink-muted" },
  { name: "Linha", hex: "#E8E6DC", use: "bordas", className: "bg-line" },
  { name: "Erro", hex: "#B3261E", use: "erros", className: "bg-danger" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-caption font-bold tracking-[0.08em] text-ink-muted uppercase">{title}</h2>
      {children}
    </section>
  );
}
