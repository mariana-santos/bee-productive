# Bee Productive

> Um favo, um check. Tarefas feitas, colmeia feliz.

Gerenciador de tarefas simples feito como desafio técnico: Next.js com App Router, backend em tRPC e tarefas guardadas em memória. Dá para listar, criar, editar e excluir tarefas, com SSR na listagem, validação nos dois lados e scroll infinito.

## Stack

| Camada           | Tecnologia                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router, Cache Components) e React 19               |
| API              | [tRPC 11](https://trpc.io) com [superjson](https://github.com/flightcontrolhq/superjson) |
| Dados no cliente | [TanStack Query 5](https://tanstack.com/query) via `@trpc/tanstack-react-query`          |
| Validação        | [Zod 4](https://zod.dev), o mesmo schema no servidor e no formulário                     |
| Estilo           | [Tailwind CSS 4](https://tailwindcss.com) com tokens de design no `@theme`               |
| Feedback         | [Sonner](https://sonner.emilkowal.ski) para os toasts                                    |
| Qualidade        | TypeScript, ESLint e Prettier                                                            |

O enunciado cita Next.js 15, mas também pede as versões mais recentes; o projeto usa o 16, a versão estável atual.

## Como rodar

Requisitos: Node.js 20.9 ou mais recente e npm.

```bash
npm install
npm run dev
```

Abra <http://localhost:3000>. O servidor já sobe com 25 tarefas fictícias, então a listagem começa com três páginas e o scroll infinito aparece logo.

Outros scripts:

| Comando                                   | O que faz                                    |
| ----------------------------------------- | -------------------------------------------- |
| `npm run build` e `npm start`             | Build e servidor de produção                 |
| `npm run lint`                            | ESLint                                       |
| `npm run format` / `npm run format:check` | Formata ou confere a formatação com Prettier |

Não há variáveis de ambiente nem banco de dados para configurar.

## Telas

| Rota               | O que tem                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `/`                | Listagem com SSR, exclusão com feedback, estado vazio, erro e scroll infinito                   |
| `/tasks/new`       | Formulário de criação com validação                                                             |
| `/tasks/[id]/edit` | Formulário de edição já preenchido, skeleton enquanto carrega e tela de "tarefa não encontrada" |
| `/design-system`   | Vitrine da identidade visual e dos componentes, com todos os estados                            |

## API (tRPC)

Os procedures ficam em `src/server/routers/tasks.ts` e são servidos em `/api/trpc`.

| Procedure       | Tipo     | Entrada                               | Saída                   |
| --------------- | -------- | ------------------------------------- | ----------------------- |
| `tasks.list`    | query    | `{ cursor?, limit? }` (padrão 0 e 10) | `{ items, nextCursor }` |
| `tasks.getById` | query    | `{ id }`                              | a tarefa                |
| `tasks.create`  | mutation | `{ title, description? }`             | a tarefa criada         |
| `tasks.update`  | mutation | `{ id, title?, description? }`        | a tarefa atualizada     |
| `tasks.delete`  | mutation | `{ id }`                              | `{ id }`                |

Cada tarefa tem `id` (UUID gerado no servidor), `title` (obrigatório, até 120 caracteres), `description` (opcional, até 500) e `createdAt` (`Date`). Os campos estão em inglês para manter o código num idioma só; a interface e as mensagens são em português.

Erros:

- **Validação** (ex.: título vazio): `BAD_REQUEST` com a mensagem "Dados inválidos" e um campo `zodError` com os erros por campo, que o formulário mostra no campo certo.
- **Tarefa inexistente** em `getById`, `update` ou `delete`: `NOT_FOUND` com "Tarefa não encontrada".
- **Erro inesperado**: `INTERNAL_SERVER_ERROR` com "Erro interno do servidor", sem stack trace nem detalhes internos na resposta.

Para testar um procedure direto pelo terminal (o `input` vai dentro de `json` por causa do superjson):

```bash
curl "http://localhost:3000/api/trpc/tasks.list?input=%7B%22json%22%3A%7B%22limit%22%3A2%7D%7D"
```

## Estrutura de pastas

```text
src/
├── app/                      Rotas do App Router
│   ├── api/trpc/[trpc]/      Route handler que expõe o tRPC
│   ├── tasks/new/            Criar tarefa
│   ├── tasks/[id]/edit/      Editar tarefa (+ not-found.tsx)
│   ├── design-system/        Vitrine dos componentes
│   ├── layout.tsx            Fontes, provider do tRPC, footer e Toaster
│   └── page.tsx              Listagem
├── server/                   Só roda no servidor
│   ├── tasks/                schema.ts (Zod e tipos), store.ts (Map em memória), seed.ts
│   ├── routers/              Procedures do tRPC e o appRouter
│   └── trpc.ts               initTRPC, superjson e errorFormatter
├── trpc/                     Integração com o TanStack Query
│   ├── client.tsx            Provider e useTRPC para Client Components
│   ├── server.tsx            Proxy, prefetch e HydrateClient para Server Components
│   └── query-client.ts       Configuração compartilhada do QueryClient
├── features/tasks/           Tudo que conhece o tipo Task e o tRPC
│   ├── components/list/      Listagem, card, exclusão, scroll infinito
│   ├── components/form/      Formulário e moldura comuns a criar e editar
│   ├── components/create/    Formulário de criação
│   ├── components/edit/      Formulário, skeleton e "não encontrada" da edição
│   └── list-query.ts         Parâmetros da infinite query (servidor e cliente)
└── components/               Genéricos, sem saber o que é uma tarefa
    ├── ui/                   Button, Field, Alert, Skeleton, Loading, EmptyState, Toaster
    └── header.tsx, footer.tsx, logo.tsx, illustrations.tsx
```

A regra é: `components/` não importa nada de `features/`, e `features/` não importa nada de outra feature.

## Decisões principais

As decisões também estão comentadas no código, perto de onde acontecem.

- **Store em memória no `globalThis`.** As tarefas ficam num `Map`. Em desenvolvimento, o hot reload reavalia os módulos; guardar o `Map` no `globalThis` evita que as tarefas sumam a cada alteração. O seed entra só quando o `Map` é criado, então recargas não duplicam nem ressuscitam tarefas.
- **Um schema Zod para os dois lados.** `src/server/tasks/schema.ts` não importa nada do servidor, então o formulário usa as mesmas regras e mensagens do tRPC. O erro aparece na hora, sem ida ao servidor, e o servidor continua validando por segurança.
- **superjson como transformer.** Sem ele, `createdAt` chegaria ao cliente como string. Com ele, chega como `Date`, tanto pela API quanto na hidratação do cache.
- **SSR da listagem com prefetch e hidratação.** A página faz o prefetch da primeira página no servidor (com `await`, para ela vir no HTML) e entrega o cache ao cliente com `HydrationBoundary`. O `useInfiniteQuery` do cliente encontra os dados prontos e não faz uma segunda requisição.
- **Cache Components e `connection()`.** Com Cache Components, o Next tenta pré-renderizar tudo no build. Como o store é síncrono, a lista seria congelada no build; `connection()` dentro de um `<Suspense>` faz a leitura acontecer a cada request. O header e o título vão no HTML estático, e a lista chega por streaming.
- **Paginação por offset.** `cursor` é o índice do primeiro item. É simples e suficiente para uma lista em memória. Como excluir um item desloca as páginas seguintes, a exclusão tira o card do cache na hora e depois recarrega a lista para corrigir os cursores.
- **Scroll infinito com `IntersectionObserver`.** Um elemento invisível no fim da lista pede a próxima página quando chega perto da tela, sem ouvir o evento de scroll. Se a próxima página falhar, as tarefas já carregadas continuam visíveis e só o rodapé mostra o erro.
- **Atraso artificial de 800 ms nas páginas seguintes.** O store responde instantaneamente, o que esconderia o estado de carregamento do scroll infinito. A primeira página, usada no SSR, não tem atraso.
- **Feedback em camadas.** Erros de validação aparecem no próprio campo (com foco no primeiro inválido); falhas que impedem uma tela de carregar viram um `Alert` no lugar do conteúdo; resultados de ações (criar, salvar, excluir) viram toasts, que sobrevivem à navegação por estarem no layout.
- **Formulário compartilhado.** Criar e editar usam o mesmo `TaskForm`; cada página só define a mutation, os textos e o que fazer no sucesso. O estado do formulário fica em `useState`.
- **Estado de páginas visitadas.** Com Cache Components, o Next guarda o estado de páginas já visitadas. Por isso o formulário é limpo depois de criar e ao cancelar, e o de edição é remontado quando a tarefa muda no servidor.
- **Datas em fuso fixo.** As datas são formatadas no fuso `America/Sao_Paulo` para o HTML do servidor e a hidratação no navegador mostrarem a mesma hora.

## Limitações

- **Os dados não persistem.** Tudo fica na memória do processo: reiniciar o servidor volta às 25 tarefas do seed, e em um deploy serverless cada instância teria a sua própria lista. Em produção, o store seria trocado por um banco de dados, sem mudar os procedures.
- **Sem autenticação.** Todas as pessoas veem e editam as mesmas tarefas.
- **Paginação por offset.** Se alguém criar ou excluir tarefas enquanto outra pessoa rola a lista, uma tarefa pode se repetir ou ser pulada entre páginas. Uma paginação por cursor (ex.: pela data de criação) resolveria isso.
- **Sem testes automatizados.** O comportamento foi conferido manualmente no navegador.
- **Status 200 na tarefa não encontrada.** Como a edição usa streaming, o status HTTP já foi enviado quando a busca falha. A página mostra a tela de "não encontrada" e recebe `noindex`, mas o status não é 404.
