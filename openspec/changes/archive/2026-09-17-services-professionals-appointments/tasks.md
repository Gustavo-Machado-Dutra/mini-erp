# Tasks

## 1. Schema Drizzle & Migrations
- [x] 1.1 Criar `src/db/schema/services.ts`, `src/db/schema/professionals.ts` e `src/db/schema/appointments.ts`.
- [x] 1.2 Exportar schemas em `src/db/schema/index.ts`.
- [x] 1.3 Gerar migration SQL via Drizzle Kit.

## 2. Modulos de Dominio, Schemas Zod & Types
- [x] 2.1 Criar `src/modules/services/` (schemas, types, queries, actions).
- [x] 2.2 Criar `src/modules/professionals/` (schemas, types, queries, actions).
- [x] 2.3 Criar `src/modules/appointments/` (schemas, types, queries, actions, validacao de conflito).

## 3. Interface Web (App Router)
- [x] 3.1 Atualizar `src/components/layout/sidebar.tsx` com navegacao para `/appointments`, `/services` e `/professionals`.
- [x] 3.2 Construir rotas `/services`, `/services/new`, `/services/[id]`, `/services/[id]/edit`.
- [x] 3.3 Construir rotas `/professionals`, `/professionals/new`, `/professionals/[id]`, `/professionals/[id]/edit`.
- [x] 3.4 Construir rotas `/appointments`, `/appointments/new`, `/appointments/[id]`, `/appointments/[id]/edit`.

## 4. Testes Automatizados & Seguranca
- [x] 4.1 Criar `tests/operations/operations-isolation.test.ts` cobrindo Services, Professionals, Appointments, prevencao de relacoes cross-tenant, conflitos de horario e IDOR.
- [x] 4.2 Executar suite de testes (`npm run test`).

## 5. Documentacao & Validacoes
- [x] 5.1 Registrar ADR-009 em `docs/DECISIONS.md`.
- [x] 5.2 Executar typecheck, lint e build.
- [x] 5.3 Atualizar `context.md` e arquivar change no OpenSpec.