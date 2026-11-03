// Garante erro de build se este arquivo for importado por um Client Component:
// ele carrega o router (e o store) e só pode rodar no servidor.
import "server-only";

/**
 * Helpers do tRPC para Server Components: pré-carregam dados no servidor e
 * os entregam ao cache do cliente via hidratação.
 */
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy, type TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";
import { makeQueryClient } from "./query-client";

// O `cache` do React memoiza a função durante um mesmo request: todos os
// Server Components de uma renderização compartilham o mesmo QueryClient, e
// cada request novo recebe um QueryClient limpo.
export const getQueryClient = cache(makeQueryClient);

// Com `router` e `ctx`, o proxy chama os procedures direto no processo,
// sem passar por HTTP. É por isso que o link com URL relativa do cliente
// não precisa funcionar no servidor.
export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: createContext,
  queryClient: getQueryClient,
});

// Serializa o cache do servidor (com superjson, ver query-client.ts) e o
// injeta no QueryClient do cliente, onde os useQuery encontram os dados prontos.
export function HydrateClient({ children }: { children: React.ReactNode }) {
  return <HydrationBoundary state={dehydrate(getQueryClient())}>{children}</HydrationBoundary>;
}

// O tipo das options de query do tRPC é genérico demais para descrever sem `any`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  // Infinite queries têm cache e formato de dados próprios ({ pages, pageParams }),
  // então precisam do prefetch específico; o tRPC marca isso na queryKey.
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
