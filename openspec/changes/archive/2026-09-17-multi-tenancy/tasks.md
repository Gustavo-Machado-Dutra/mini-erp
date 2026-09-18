# Tasks

## 1. Schema Drizzle de Tenancy

- [ ] 1.1 Criar `src/db/schema/tenancy.ts` com tabelas `organizations`, `organization_members` e `profiles`; verificar que `drizzle-orm/pg-core` exporta tipos corretos.
- [ ] 1.2 Exportar `tenancy.ts` em `src/db/schema/index.ts`.

## 2. Tipos e Validacoes de Dominio

- [ ] 2.1 Criar `src/modules/tenancy/types.ts` com schemas Zod (`createOrganizationSchema`, `switchOrganizationSchema`) e tipos TypeScript.

## 3. Tenant Context e Helpers de Autorizacao

- [ ] 3.1 Criar `src/modules/tenancy/context.ts` contendo:
  - `requireSession()`: garante autenticacao ativa
  - `requireOrganization(organizationId?: string)`: valida membership no banco
  - `requireOrganizationRole(allowedRoles, organizationId?)`: valida role hierarquica
  - `getUserOrganizations(userId: string)`: lista organizacoes permitidas
  - `setActiveOrganizationCookie(organizationId: string)`: define cookie seguro

## 4. Server Actions de Tenancy

- [ ] 4.1 Criar `src/modules/tenancy/actions.ts` com:
  - `createOrganizationAction`: criacao transacional de organizacao + membership owner
  - `switchOrganizationAction`: troca validada de organizacao ativa
  - `getUserOrganizationsAction`: listagem para selecao

## 5. Interface de Usuario (UI)

- [ ] 5.1 Criar pagina `/organizations/new` (`src/app/(protected)/organizations/new/page.tsx`) com formulario de criacao e validacao Zod.
- [ ] 5.2 Atualizar `/dashboard` (`src/app/(protected)/dashboard/page.tsx`) com seletor de organizacoes do usuario, exibicao da role atual e status do tenant ativo.

## 6. Testes de Isolamento Multi-Tenant

- [ ] 6.1 Criar `tests/tenancy/isolation.test.ts` cobrindo os 7 cenarios mandatorios de isolamento, autorizacao e prevencao de IDOR.
- [ ] 6.2 Adicionar script de teste unitario no `package.json` e validar execucao dos testes.

## 7. Documentacao e Decisoes

- [ ] 7.1 Registrar ADR-006 em `docs/DECISIONS.md` sobre a arquitetura de Multi-Tenancy e autorizacao server-side.

## 8. Validacao

- [ ] 8.1 Executar `npm run typecheck` e confirmar zero erros.
- [ ] 8.2 Executar `npm run lint` e confirmar zero erros.
- [ ] 8.3 Executar `npm run build` e confirmar build com sucesso.
- [ ] 8.4 Executar suite de testes (`npm test`) e confirmar PASS.