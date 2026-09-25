# Tasks

## 1. Schema Drizzle & Migrations
- [x] 1.1 Criar `src/db/schema/customers.ts` com definicao da tabela `customers`, constraints, chaves estrangeiras e indices.
- [x] 1.2 Exportar schema de clientes em `src/db/schema/index.ts`.
- [x] 1.3 Gerar arquivo de migration SQL do Drizzle via drizzle-kit.

## 2. Dominio, Validacao Zod & Tipos
- [x] 2.1 Criar `src/modules/customers/schemas.ts` com `createCustomerSchema` e `updateCustomerSchema`.
- [x] 2.2 Criar `src/modules/customers/types.ts` com tipos de entrada, saida e retorno de actions.

## 3. Consultas e Mutacoes Server-Side
- [x] 3.1 Criar `src/modules/customers/queries.ts` com funcoes `getCustomers` (busca + tenant scoping) e `getCustomerById`.
- [x] 3.2 Criar `src/modules/customers/actions.ts` com `createCustomerAction` e `updateCustomerAction`.

## 4. Interface Web (App Router)
- [x] 4.1 Criar `src/app/(protected)/customers/page.tsx` com listagem, busca e empty state.
- [x] 4.2 Criar `src/app/(protected)/customers/loading.tsx` para skeleton/loading da listagem.
- [x] 4.3 Criar `src/app/(protected)/customers/new/page.tsx` com formulario de criacao de cliente.
- [x] 4.4 Criar `src/app/(protected)/customers/[id]/page.tsx` com visualizacao detalhada de dados do cliente.
- [x] 4.5 Criar `src/app/(protected)/customers/[id]/edit/page.tsx` com formulario de edicao.
- [x] 4.6 Criar componente reutilizavel de formulario `customer-form.tsx`.

## 5. Testes Automatizados e Seguranca
- [x] 5.1 Criar `tests/customers/customer-isolation.test.ts` cobrindo operacoes CRUD, isolamento multi-tenant, prevencao de IDOR e autorizacao.
- [x] 5.2 Executar suite de testes (`npm run test`).

## 6. Documentacao e Validacoes
- [x] 6.1 Registrar ADR-007 em `docs/DECISIONS.md` sobre a estrategia de ausencia de exclusao fisica no MVP.
- [x] 6.2 Executar typecheck, lint e build.
- [x] 6.3 Atualizar `context.md` e arquivar change no OpenSpec.