/**
 * Ponto de entrada HTTP do tRPC no App Router.
 *
 * O segmento dinâmico [trpc] captura o nome do procedure (ex.: /api/trpc/tasks.list),
 * e o adapter `fetch` funciona direto com os Request/Response nativos dos Route Handlers.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    // A resposta ao cliente é enxuta (sem stack trace, ver errorFormatter);
    // em dev registramos o erro completo no terminal para facilitar a depuração.
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => console.error(`tRPC falhou em ${path ?? "<sem path>"}:`, error)
        : undefined,
  });
}

// Queries chegam via GET e mutations via POST.
export { handler as GET, handler as POST };
