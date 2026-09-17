# Proposal

## Why

A Fase 1 (Foundation) criou a aplicacao Next.js com Drizzle e Better Auth instalados, mas sem banco real e sem autenticacao funcional. Nenhum usuario pode se cadastrar, logar ou ter sessao. Sem autenticacao, nenhuma funcionalidade de dominio pode ser desenvolvida com seguranca. Esta mudanca implementa sign up, sign in, sign out e sessao — o prerequisito para todas as fases seguintes.

## What Changes

- Gerar schema Drizzle das tabelas Better Auth (user, session, account, verification)
- Configurar Better Auth com email/password provider completo
- Criar cliente Better Auth para o browser (createAuthClient)
- Criar paginas /login e /register com formularios validados por Zod
- Criar pagina /dashboard como rota protegida minima para validar sessao
- Implementar middleware Next.js para protecao de rotas autenticadas
- Criar helper getSession server-side para uso em Server Components/Actions
- Corrigir package.json (dependencias faltantes: zod, typescript)
- Validar build sem erros

## Capabilities

### New Capabilities

- `auth/email-password`: Usuarios podem se cadastrar e autenticar com email e senha via Better Auth; sessao gerenciada por cookie httpOnly

### Modified Capabilities

- `foundation/auth-bootstrap`: A instancia Better Auth agora inclui schema Drizzle completo e email/password habilitado; o route handler esta funcional

## Impact

- Arquivos criados: src/lib/auth-client.ts, src/db/schema/auth.ts, src/app/(auth)/login/page.tsx, src/app/(auth)/register/page.tsx, src/app/(protected)/dashboard/page.tsx, src/middleware.ts
- Arquivos modificados: src/lib/auth.ts, src/db/schema/index.ts, package.json, drizzle.config.ts
- Dependencias: nenhuma nova (Better Auth, Zod, Drizzle ja instalados)
- Tabelas PostgreSQL: user, session, account, verification (gerenciadas pelo Better Auth)