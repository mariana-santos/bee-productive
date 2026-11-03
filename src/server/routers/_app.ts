import { router } from "../trpc";
import { tasksRouter } from "./tasks";

export const appRouter = router({
  tasks: tasksRouter,
});

// Só o tipo vai para o frontend: o cliente tRPC infere inputs e outputs a
// partir dele sem importar nenhum código do servidor.
export type AppRouter = typeof appRouter;
