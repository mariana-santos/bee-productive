/**
 * Inicialização do tRPC. Este arquivo deve ser importado apenas no servidor.
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";

// Ainda não há nada no contexto (sem autenticação nem banco), mas a função já
// existe para o route handler e o SSR terem um ponto único onde montá-lo.
export async function createContext() {
  return {};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  // JSON puro transforma Date em string, então `createdAt` chegaria ao cliente
  // como texto. O superjson serializa e restaura tipos como Date, e o cliente
  // recebe exatamente o tipo `Task` do servidor. O mesmo transformer precisa
  // ser configurado no link do cliente tRPC.
  transformer: superjson,
  // Por padrão o tRPC inclui o stack trace na resposta fora de produção.
  // Desligamos para nunca expor detalhes internos ao cliente.
  isDev: false,
  errorFormatter({ shape, error }) {
    // Quando a falha vem do .input() com Zod, anexamos os erros por campo em
    // `data.zodError` para o formulário mostrar cada mensagem ao lado do campo.
    // No Zod 4, `error.flatten()` está depreciado; `z.flattenError` é o
    // substituto direto. Usamos ele, e não `z.treeifyError`, porque o
    // formulário é plano: `fieldErrors.title?.[0]` já basta, sem árvore aninhada.
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
