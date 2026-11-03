/**
 * Fábrica do QueryClient, compartilhada pelo provider do cliente e pelo SSR.
 */
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query";
import superjson from "superjson";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Com staleTime > 0, os dados que vieram do SSR são considerados frescos
        // por 30s, e o cliente não refaz a mesma busca logo após a hidratação.
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // O backend usa superjson como transformer, então os dados no cache têm
        // Date de verdade. Serializamos com superjson ao enviar o cache do servidor
        // para o cliente, para o `createdAt` não virar string no caminho.
        serializeData: superjson.serialize,
        // Inclui queries ainda "pending": assim um prefetch no servidor pode ser
        // disparado sem await, e a promise é transmitida para o cliente via streaming.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}
