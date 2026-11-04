/**
 * Tarefas fictícias carregadas quando o servidor sobe, para a listagem já
 * começar com mais de uma página e dar para ver o scroll infinito funcionando
 * (são 25 tarefas e cada página traz 10).
 *
 * Todo o conteúdo é inventado: nenhum nome, dado pessoal ou informação real.
 */
import type { Task } from "./schema";

const seedTasks: { title: string; description?: string }[] = [
  {
    title: "Revisar o README do projeto",
    description: "Conferir instruções de setup e decisões técnicas.",
  },
  { title: "Comprar café para a equipe" },
  {
    title: "Planejar a sprint de dezembro",
    description: "Levantar prioridades com o time e estimar as tarefas.",
  },
  {
    title: "Atualizar dependências",
    description: "Next.js, tRPC e Zod nas versões mais recentes.",
  },
  { title: "Regar as plantas do escritório" },
  {
    title: "Escrever testes do formulário",
    description: "Cobrir validação do título e os estados de envio.",
  },
  {
    title: "Organizar a reunião de retrospectiva",
    description: "Reservar sala e preparar o quadro de post-its.",
  },
  { title: "Responder os e-mails pendentes" },
  {
    title: "Revisar o pull request do header",
    description: "Checar o header fixo em telas pequenas.",
  },
  {
    title: "Preparar a apresentação da demo",
    description: "Mostrar criação, edição, exclusão e o scroll infinito.",
  },
  { title: "Limpar a caixa de entrada" },
  {
    title: "Documentar a API de tarefas",
    description: "Listar os procedures do tRPC e os erros de cada um.",
  },
  { title: "Agendar a revisão de acessibilidade" },
  { title: "Trocar a lâmpada da sala de reuniões" },
  { title: "Ajustar o contraste dos botões", description: "Garantir pelo menos 4.5:1 no texto." },
  { title: "Fazer backup das anotações da semana" },
  {
    title: "Estudar Cache Components do Next.js",
    description: "Entender connection(), Suspense e o shell estático.",
  },
  { title: "Comprar mel para o lanche da tarde" },
  {
    title: "Revisar mensagens de erro",
    description: "Todas em português e explicando o que fazer.",
  },
  { title: "Configurar o Prettier no editor" },
  {
    title: "Criar o estado vazio da listagem",
    description: "Ilustração da colmeia vazia e botão de nova tarefa.",
  },
  { title: "Marcar o almoço do time" },
  {
    title: "Testar o app no celular",
    description: "Header, cards e formulário em 375px de largura.",
  },
  {
    title: "Separar ideias para a próxima versão",
    description: "Filtros, busca e marcar tarefa como concluída.",
  },
  { title: "Tirar um tempo para descansar" },
];

/** Cria as tarefas com datas espaçadas de 3 em 3 horas, a mais recente primeiro. */
export function createSeedTasks(now = new Date()): Task[] {
  return seedTasks.map((task, index) => ({
    id: crypto.randomUUID(),
    title: task.title,
    description: task.description,
    createdAt: new Date(now.getTime() - index * 3 * 60 * 60 * 1000),
  }));
}
