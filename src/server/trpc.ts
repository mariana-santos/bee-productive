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
  // Por padrão o tRPC inclui o stack trace na resposta fora de produção.
  // Desligamos para nunca expor detalhes internos ao cliente.
  isDev: false,
  errorFormatter({ shape, error }) {
    const zodError = error.cause instanceof ZodError ? z.flattenError(error.cause) : null;

    // Erros inesperados (ex.: exceção não tratada) podem carregar detalhes de
    // implementação na mensagem, então o cliente recebe só um texto genérico.
    // Erros de validação já trazem os detalhes por campo em `zodError`, então
    // a mensagem principal fica curta em vez do JSON cru das issues.
    let message = shape.message;
    if (error.code === "INTERNAL_SERVER_ERROR") message = "Erro interno do servidor";
    else if (zodError) message = "Dados inválidos";

    return {
      ...shape,
      message,
      data: { ...shape.data, zodError },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
