# Tasks

## 1. Schema Drizzle & Migrations
- [ ] 1.1 Criar `src/db/schema/follow-ups.ts` com enums `follow_up_type`, `follow_up_status`, `follow_up_channel` e tabela `follow_ups`.
- [ ] 1.2 Exportar em `src/db/schema/index.ts`.
- [ ] 1.3 Gerar migration SQL via Drizzle Kit.

## 2. Modulo de Dominio, Zod & Tipos
- [ ] 2.1 Criar `src/modules/follow-ups/types.ts` com enums, labels, cores e interfaces.
- [ ] 2.2 Criar `src/modules/follow-ups/schemas.ts` com `createFollowUpSchema`, `updateFollowUpSchema`, `completeFollowUpSchema` e `cancelFollowUpSchema`.
- [ ] 2.3 Criar `src/modules/follow-ups/queries.ts` com filtros temporais (hoje, atrasados, proximos, concluidos).
- [ ] 2.4 Criar `src/modules/follow-ups/actions.ts` com `createFollowUpAction`, `updateFollowUpAction`, `completeFollowUpAction` e `cancelFollowUpAction`.

## 3. Interface Web (App Router)
- [ ] 3.1 Atualizar `src/components/layout/sidebar.tsx` com link para `/follow-ups`.
- [ ] 3.2 Criar componentes visuais: `status-badge.tsx`, `complete-dialog.tsx`.
- [ ] 3.3 Criar `src/app/(protected)/follow-ups/page.tsx` com abas e contadores.
- [ ] 3.4 Criar `src/app/(protected)/follow-ups/loading.tsx`.
- [ ] 3.5 Criar `src/app/(protected)/follow-ups/new/page.tsx` com selecao de Lead/Customer.
- [ ] 3.6 Criar `src/app/(protected)/follow-ups/[id]/page.tsx` com detalhes e acoes.
- [ ] 3.7 Criar `src/app/(protected)/follow-ups/[id]/edit/page.tsx`.
- [ ] 3.8 Criar `src/app/(protected)/follow-ups/follow-up-form.tsx`.

## 4. Testes Automatizados & Seguranca
- [ ] 4.1 Criar `tests/follow-ups/follow-up-isolation.test.ts` cobrindo criacao, conclusao, cancelamento, filtros temporais, IDOR e integridade cross-tenant.
- [ ] 4.2 Executar suite de testes (`npm run test`).

## 5. Documentacao & Validacoes
- [ ] 5.1 Registrar ADR-010 em `docs/DECISIONS.md`.
- [ ] 5.2 Executar typecheck, lint e build.
- [ ] 5.3 Atualizar `context.md` e arquivar change no OpenSpec.