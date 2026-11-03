"use client";

/**
 * Integração do tRPC com o TanStack Query no lado do cliente.
 */
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import superjson from "superjson";
// `import type` é apagado na compilação: o cliente recebe só o tipo do router
// para inferir inputs e outputs, e nenhum código do servidor (store, procedures)
// entra no bundle do navegador.
import type { AppRouter } from "@/server/routers/_app";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  // No servidor, cada request ganha um QueryClient novo, para que dados de um
  // usuário nunca vazem para a resposta de outro.
  if (typeof window === "undefined") return makeQueryClient();
  // No navegador, mantemos um único QueryClient. Não usamos useState aqui porque
  // o React pode descartar o estado se o primeiro render suspender, e o cache se perderia.
  return (browserQueryClient ??= makeQueryClient());
}

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // URL relativa: no navegador ela resolve para a própria origem. No servidor,
          // os dados das páginas vêm de um prefetch feito direto no router, então
          // este cliente HTTP só é usado no navegador.
          url: "/api/trpc",
          // Precisa ser o mesmo transformer do servidor (ver src/server/trpc.ts).
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
