/**
 * Parâmetros da infinite query da listagem, compartilhados entre o prefetch do
 * servidor (page.tsx) e o useInfiniteQuery do cliente (TaskList). Os dois
 * precisam gerar a mesma queryKey para o cliente reaproveitar os dados do SSR.
 */
export const taskListInput = { limit: 10 };

export const taskListOptions = {
  // O servidor devolve `nextCursor: null` na última página, o que encerra o scroll.
  getNextPageParam: (lastPage: { nextCursor: number | null }) => lastPage.nextCursor,
};
