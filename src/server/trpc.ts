/**
 * Inicialização do tRPC. Este arquivo deve ser importado apenas no servidor.
 */
import { initTRPC } from "@trpc/server";
import { z, ZodError } from "zod";

// Ainda não há nada no contexto (sem autenticação nem banco), mas a função já
// existe para o route handler e o SSR terem um ponto único onde montá-lo.
export async function createContext() {
  return {};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  // Quando a falha vem da validação do Zod, anexamos os erros por campo à
  // resposta. Assim o frontend consegue mostrar a mensagem ao lado do campo.
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? z.flattenError(error.cause) : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
