# Design

## Context

A Fase 1 criou a fundacao: Next.js 15 + TS strict + Tailwind + shadcn/ui + Drizzle + Better Auth (instalados) + Zod. O banco PostgreSQL e placeholder — nao existe banco real. O Better Auth logava aviso de schema mismatch no build porque as tabelas nao existem. Esta fase resolve isso.

## Goals / Non-Goals

**Goals:**
- Tabelas Better Auth definidas como schema Drizzle (user, session, account, verification) — prontas para migration
- Better Auth funcional: sign up, sign in, sign out com email/password
- Sessao segura via cookie httpOnly
- Cliente Better Auth para browser (createAuthClient)
- Paginas /login e /register com formularios e validacao Zod
- Pagina /dashboard protegida (placeholder para validar sessao)
- Middleware Next.js para protecao de rotas
- Helper getSession para Server Components/Actions
- Build sem erros e sem o aviso de schema mismatch

**Non-Goals:**
- Organizations, memberships, multi-tenancy (Fase 3)
- OAuth providers (Google, GitHub) — nao necessarios para MVP agora
- RBAC ou permissoes alem de "autenticado vs nao autenticado"
- Paginas de dominio (customers, leads, pipeline)
- Testes E2E completos com Playwright (sera preparado mas nao exigido nesta fase)
- Password reset ou email verification (pode ser adicionado depois)

## Decisions

### Schema Better Auth como Drizzle puro

**Escolha:** Definir as tabelas do Better Auth manualmente no Drizzle schema, seguindo os nomes que o Better Auth espera (user, session, account, verification).
**Razao:** O Better Auth v1.7 com drizzleAdapter espera tabelas com nomes especificos. Usar o CLI `npx @better-auth/cli generate` pode gerar schema incompativel com a versao. Definir manualmente garante controle total e alinha com a filosofia do spec.md de manter o dominio sob controle.
**Alternativas descartadas:** Usar o CLI `generate` (dependencia de versao especifica); deixar o Better Auth criar tabelas automaticamente (sem controle do schema).

### Nao usar Organizations plugin do Better Auth

**Escolha:** Nao ativar o Organizations plugin na Fase 2.
**Razao:** O spec.md define um modelo de dominio especifico (User → Profile → Organization Members → Organizations) com campos e regras proprias. O plugin Organizations do Better Auth impoe nomes e relacionamentos que podem conflitar com o spec. Organizations sera implementado na Fase 3 com tabelas Drizzle customizadas, mantendo o Better Auth focado em autenticacao e sessao.
**ADR:** Sera registrado em docs/DECISIONS.md como ADR-005.

### Middleware para protecao de rotas

**Escolha:** Usar middleware do Next.js (`src/middleware.ts`) para verificar cookie de sessao e redirecionar para /login em rotas protegidas.
**Razao:** O middleware roda no edge antes de qualquer Server Component — impede que rotas protegidas sejam processadas sem autenticacao. E a recomendacao do Next.js para protecao de rotas.
**Nota:** O middleware verifica apenas a existencia do cookie de sessao. A validacao real da sessao (contra o banco) acontece no Server Component/Action via getSession.

### Layout groups para separar rotas publicas e protegidas

**Escolha:** Usar route groups do Next.js App Router — `(auth)` para /login e /register, `(protected)` para /dashboard e futuras rotas autenticadas.
**Razao:** Permite layouts diferentes (auth sem sidebar, protected com sidebar futuramente) sem afetar a URL. Alinha com a arquitetura definida no spec.md (sidebar com dashboard, leads, etc).

## Risks / Trade-offs

- **Sem banco real no ambiente de dev:** O schema Drizzle sera definido, mas a migration so funciona com DATABASE_URL real. O build deve funcionar sem banco ativo. Documentar isso claramente no .env.example.
- **Middleware nao valida sessao contra banco:** Um cookie expirado pode passar pelo middleware ate o Server Component verificar. Mitigacao: getSession valida contra o banco; o middleware e apenas um guard rapido.