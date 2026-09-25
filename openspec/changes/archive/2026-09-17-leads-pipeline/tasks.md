# Tasks

## 1. Schema Drizzle & Migrations
- [x] 1.1 Criar `src/db/schema/leads.ts` com enum `leadStageEnum` e tabela `leads`.
- [x] 1.2 Exportar schema de leads em `src/db/schema/index.ts`.
- [x] 1.3 Gerar migration SQL via Drizzle Kit.

## 2. Dominio, Validacao Zod & Tipos
- [x] 2.1 Criar `src/modules/leads/schemas.ts` com `createLeadSchema`, `updateLeadSchema` e `updateLeadStageSchema`.
- [x] 2.2 Criar `src/modules/leads/types.ts` com tipos de entrada, saida e dicionario de estagios.

## 3. Consultas e Mutacoes Server-Side
- [x] 3.1 Criar `src/modules/leads/queries.ts` com `getLeads`, `getLeadById` e `getLeadsGroupedByStage`.
- [x] 3.2 Criar `src/modules/leads/actions.ts` com `createLeadAction`, `updateLeadAction` e `updateLeadStageAction`.

## 4. Interface Web (App Router)
- [x] 4.1 Criar componentes visuais: `stage-badge.tsx`, `stage-select.tsx` e `pipeline-view.tsx`.
- [x] 4.2 Criar `src/app/(protected)/leads/page.tsx` com visualizacao de Pipeline e Lista.
- [x] 4.3 Criar `src/app/(protected)/leads/loading.tsx` para skeleton loading.
- [x] 4.4 Criar `src/app/(protected)/leads/new/page.tsx` com formulario de cadastro e associacao a cliente.
- [x] 4.5 Criar `src/app/(protected)/leads/[id]/page.tsx` com detalhes, acoes de estagio e historico.
- [x] 4.6 Criar `src/app/(protected)/leads/[id]/edit/page.tsx` com formulario de edicao.
- [x] 4.7 Criar `src/app/(protected)/leads/lead-form.tsx`.

## 5. Testes Automatizados e Seguranca
- [x] 5.1 Criar `tests/leads/lead-isolation.test.ts` cobrindo operacoes CRUD, estagios, isolamento multi-tenant, IDOR e integridade referencial cross-tenant de clientes.
- [x] 5.2 Executar suite de testes (`npm run test`).

## 6. Documentacao e Validacoes
- [x] 6.1 Registrar ADR-008 em `docs/DECISIONS.md`.
- [x] 6.2 Executar typecheck, lint e build.
- [x] 6.3 Atualizar `context.md` e arquivar change no OpenSpec.