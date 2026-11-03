import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import { createTaskSchema, idSchema, listTasksSchema, updateTaskSchema } from "../tasks/schema";
import * as store from "../tasks/store";

// O store retorna undefined/false quando a tarefa não existe; aqui isso vira
// um NOT_FOUND com mensagem clara, que chega ao cliente como erro tipado.
// A validação dos inputs não se repete aqui: o .input() com Zod já responde
// BAD_REQUEST antes do procedure rodar.
function notFound() {
  return new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });
}

export const tasksRouter = router({
  // Recebe `cursor` e `limit` e devolve `nextCursor`, o formato que o
  // useInfiniteQuery do tRPC espera para buscar a próxima página.
  list: publicProcedure.input(listTasksSchema).query(({ input }) => store.list(input)),

  getById: publicProcedure.input(idSchema).query(({ input }) => {
    const task = store.getById(input.id);
    if (!task) throw notFound();
    return task;
  }),

  create: publicProcedure.input(createTaskSchema).mutation(({ input }) => store.create(input)),

  update: publicProcedure.input(updateTaskSchema).mutation(({ input }) => {
    const { id, ...changes } = input;
    const task = store.update(id, changes);
    if (!task) throw notFound();
    return task;
  }),

  delete: publicProcedure.input(idSchema).mutation(({ input }) => {
    if (!store.remove(input.id)) throw notFound();
    return { id: input.id };
  }),
});
