/**
 * Store de tarefas em memória.
 *
 * Limitação: os dados vivem só na memória do processo Node. Eles somem ao
 * reiniciar o servidor e não são compartilhados entre instâncias (em um deploy
 * serverless, cada instância teria sua própria lista). O desafio dispensa
 * persistência; para produção isso seria trocado por um banco de dados.
 *
 * As funções não lançam erros: quando a tarefa não existe retornam
 * undefined/false, e os procedures do tRPC decidem qual erro devolver.
 */
import type { CreateTaskInput, ListTasksInput, Task } from "./schema";

// Em dev, o hot reload do Next reavalia este módulo a cada alteração, o que
// recriaria o Map e apagaria as tarefas. Guardar o Map em globalThis faz ele
// sobreviver às recargas, já que globalThis é o mesmo durante todo o processo.
const globalForTasks = globalThis as unknown as { tasks?: Map<string, Task> };
const tasks = (globalForTasks.tasks ??= new Map<string, Task>());

type TaskChanges = Partial<CreateTaskInput>;

// Descrição vazia (depois do trim do schema) é tratada como "sem descrição".
function normalizeDescription(description: string | undefined) {
  return description ? description : undefined;
}

export function list({ cursor, limit }: ListTasksInput) {
  // Paginação por offset: `cursor` é o índice do primeiro item da página.
  // Ordenamos a cada chamada, o que é simples e suficiente para uma lista em memória.
  // O reverse() antes do sort (que é estável) mantém as mais novas primeiro
  // mesmo quando duas tarefas são criadas no mesmo milissegundo.
  const sorted = [...tasks.values()]
    .reverse()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const items = sorted.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < sorted.length ? cursor + limit : null;

  return { items, nextCursor };
}

export function getById(id: string) {
  return tasks.get(id);
}

export function create(input: CreateTaskInput) {
  const task: Task = {
    id: crypto.randomUUID(),
    title: input.title,
    description: normalizeDescription(input.description),
    createdAt: new Date(),
  };
  tasks.set(task.id, task);
  return task;
}

export function update(id: string, input: TaskChanges) {
  const current = tasks.get(id);
  if (!current) return undefined;

  // Só altera os campos enviados; `id` e `createdAt` nunca mudam.
  const updated: Task = {
    ...current,
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && {
      description: normalizeDescription(input.description),
    }),
  };
  tasks.set(id, updated);
  return updated;
}

export function remove(id: string) {
  return tasks.delete(id);
}
