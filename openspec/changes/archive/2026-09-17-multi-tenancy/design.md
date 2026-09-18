# Design

## Context

Apos a Fase 2 (Auth), o sistema possui `user`, `session`, `account` e `verification`. Agora precisamos introduzir a camada de Tenancy do RevenueFlow mantendo os principios de simplicidade, tipagem estrita (Drizzle) e seguranca multi-tenant conforme `spec.md`.

## Goals / Non-Goals

**Goals:**
- Schema Drizzle para `organizations`, `organization_members` e `profiles`.
- Roles: `owner`, `admin`, `member`.
- Constraint unica `(organization_id, user_id)` em `organization_members`.
- Tenant context e helpers server-side: `requireSession`, `requireOrganization`, `requireOrganizationRole`, `resolveActiveOrganization`.
- Server Actions validadas com Zod para criacao de organizacao e troca de tenant ativo.
- UI minima para criacao de organizacao (`/organizations/new`), selecao de organizacao e exibicao no `/dashboard`.
- Testes unitarios cobrindo os 7 cenarios mandatorios de isolamento de tenant.

**Non-Goals:**
- Nao usar o plugin Organizations do Better Auth (reafirmando ADR-005).
- Nao implementar tabelas de negocio (Customers, Leads, etc.).
- Nao implementar RBAC complexo ou permissoes granulares alem dos 3 papeis basicos.
- Nao introduzir Supabase RLS ou servicos externos.

## Decisions

### Schema de Tenancy no Dominio RevenueFlow (ADR-006)

**Escolha:** Tabelas criadas no Drizzle (`src/db/schema/tenancy.ts`) com UUIDs gerados (`gen_random_uuid()`), foreign keys estritas e timestamps.
**Razao:** Mantem total aderencia ao modelo do `spec.md` (User -> Profile -> Organization Members -> Organizations) sem depender de plugins proprietarios.

### Resolucao de Tenant Ativo via Cookie Seguro + Validacao no Banco

**Escolha:** O cliente pode sugerir uma organizacao ativa gravando um cookie `active_org_id`, mas o servidor SEMPRE verifica se existe uma linha correspondente em `organization_members` para o `session.user.id`.
**Razao:** O cliente nao tem autoridade para escolher arbitrariamente uma organizacao. Se o usuario tentar forjar um `organization_id` de terceiro no cookie ou no parametro de Server Action, o helper `requireOrganization` rejeita com erro 403.

### Helpers de Autorizacao Server-Side

```typescript
// Fluxo:
const session = await requireSession();
const { organization, membership } = await requireOrganization(targetOrgId);
await requireOrganizationRole(['owner', 'admin'], targetOrgId);
```

Todas as Server Actions organizacionais passam por esse funil antes de executar qualquer mutacao.

## Risks / Trade-offs

- **Troca de organizacao:** Se o usuario for membro de multiplas organizacoes, a escolha da organizacao ativa deve ser persistida para uma navegacao fluida. O uso de cookie `rf_active_org` com verificacao no banco atende a essa necessidade sem complexidade.