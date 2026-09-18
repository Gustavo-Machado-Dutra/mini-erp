# Proposal

## Why

A Fase 2 estabeleceu a autenticacao e sessao com Better Auth. No entanto, o RevenueFlow e um SaaS B2B multi-tenant: usuarios devem pertencer a organizacoes (empresas clientes), e todos os dados e acoes devem ser isolados estritamente pelo tenant autorizado. Sem a camada de multi-tenancy, a aplicacao nao consegue isolar dados entre empresas nem atribuir papeis (owner, admin, member).

## What Changes

- Modelar tabelas Drizzle do dominio de tenancy: `organizations`, `organization_members` e `profiles` com constraints, chaves estrangeiras e indices.
- Implementar helpers de autorizacao e tenant context server-side (`requireSession`, `requireOrganization`, `requireOrganizationRole`, `getUserOrganizations`).
- Implementar Server Actions para criacao transacional de organizacao (criando organizacao e membership como `owner`), selecao de organizacao ativa e listagem de organizacoes do usuario.
- Proteger rotas organizacionais contra IDOR e manipulacao de `organization_id` por usuarios nao autorizados.
- Criar interface minima para criacao de organizacao (`/organizations/new`), seletor de organizacao e exibicao do tenant ativo no `/dashboard`.
- Criar suite de testes de isolamento multi-tenant cobrindo os 7 cenarios obrigatorios de seguranca.
- Documentar decisoes arquiteturais (ADR-006).

## Capabilities

### New Capabilities

- `tenancy/organizations`: Gestao de organizacoes, vinculo de membros (membership) com papeis (`owner`, `admin`, `member`), resolucao segura de tenant ativo e barreiras server-side de isolamento de dados.

### Modified Capabilities

- `auth/email-password`: O fluxo pos-login agora redireciona para a organizacao ativa ou tela de criacao de organizacao caso o usuario nao possua nenhuma.

## Impact

- Arquivos criados: `src/db/schema/tenancy.ts`, `src/modules/tenancy/types.ts`, `src/modules/tenancy/actions.ts`, `src/modules/tenancy/context.ts`, `src/app/(protected)/organizations/new/page.tsx`, `tests/tenancy/isolation.test.ts`.
- Arquivos modificados: `src/db/schema/index.ts`, `src/app/(protected)/dashboard/page.tsx`, `docs/DECISIONS.md`.
- Schema: tabelas `organizations`, `organization_members`, `profiles`.