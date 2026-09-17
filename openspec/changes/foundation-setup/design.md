# Design

## Context

O projeto RevenueFlow não possui nenhuma base de código. O repositório contém apenas documentação (spec.md, context.md) e configuração de ferramentas (OpenSpec, skills de agente). É o ponto de partida absoluto da Fase 1 do roadmap.

Ambiente de desenvolvimento confirmado:
- Node.js v24 (LTS mais recente)
- npm 11
- Windows (PowerShell); o projeto deve funcionar cross-platform
- OpenSpec 1.13.1 instalado

## Goals / Non-Goals

**Goals:**
- Aplicação Next.js 15 com App Router, TypeScript strict, Tailwind CSS e shadcn/ui funcionando
- Drizzle ORM configurado com cliente type-safe apontando para PostgreSQL
- Better Auth instalado e configurado (instância do servidor, sem providers completos ainda)
- Zod disponível para validação server-side
- Estrutura de pastas do monólito modular definida e aplicada
- ESLint e TypeScript compilando sem erros
- .env.example com todas as variáveis documentadas
- Git inicializado com commit inicial
- docs/DECISIONS.md registrando a decisão arquitetural da fundação

**Non-Goals:**
- Autenticação funcional end-to-end (login/logout/sessão) — isso é Fase 2
- Schema de banco completo com entidades de domínio — será adicionado nas fases seguintes
- Páginas funcionais além de um placeholder mínimo (/)
- Testes E2E — serão adicionados progressivamente junto com as funcionalidades
- Deploy ou CI/CD — MVP não vai a produção nesta etapa

## Decisions

### Next.js 15 com App Router

**Escolha:** Next.js 15 com App Router.
**Razão:** O spec.md exige Server Components, Server Actions e Route Handlers — o App Router é o único que suporta todos. Next.js 15 é a versão estável mais recente.
**Alternativas consideradas:** Pages Router (descartado — não suporta Server Actions nativamente), framework externo como NestJS (explicitamente proibido pelo spec.md).

### TypeScript strict

**Escolha:** "strict": true no tsconfig.json.
**Razão:** O spec.md exige TypeScript strict. Captura bugs em tempo de compilação, especialmente importante para multi-tenancy onde erros de tipo podem significar vazamento de dados.
**Alternativas:** Modo permissivo (descartado — contra o spec.md).

### Drizzle ORM com PostgreSQL

**Escolha:** Drizzle ORM + postgres (driver nativo) ou @neondatabase/serverless dependendo do ambiente de desenvolvimento.
**Razão:** O spec.md especifica Drizzle + PostgreSQL explicitamente. Drizzle é type-safe, leve e não exige geração de código em tempo de execução.
**Decisão de driver:** Usar postgres (driver puro) como dependência principal. Suporte a edge runtime pode ser adicionado depois se necessário.

### Better Auth

**Escolha:** Better Auth como sistema de autenticação.
**Razão:** Especificado explicitamente no spec.md. Oferece integração nativa com Drizzle e Next.js, suporta multi-tenant nativamente via organizations plugin.
**Configuração inicial:** Apenas a instância do servidor (uth em src/lib/auth.ts). Providers e rotas completas são Fase 2.

### Estrutura de diretórios

**Escolha:** Monólito modular com separação por domínio dentro de src/.
`
src/
  app/           — Next.js App Router (rotas, layouts, páginas)
  lib/           — utilitários compartilhados: db.ts, auth.ts
  db/
    schema/      — definições de tabelas Drizzle
    migrations/  — arquivos de migração gerados pelo drizzle-kit
  modules/       — módulos de domínio (cada um terá actions/, queries/, types/)
  components/
    ui/          — componentes shadcn/ui gerados
`
**Razão:** Alinha com arquitetura de monólito modular do spec.md. Separa infra (lib/, db/) de domínio (modules/). Permite crescimento sem reorganização agressiva.

### Secrets e acesso ao banco

**Escolha:** DATABASE_URL e BETTER_AUTH_SECRET existem apenas em .env (server-only). O arquivo src/lib/db.ts usa server-only do Next.js para garantir que não vaze ao cliente.
**Razão:** Requisito de segurança do spec.md — secrets nunca chegam ao bundle cliente.

## Risks / Trade-offs

- **Node.js v24 + Next.js 15:** compatibilidade esperada mas versões muito novas podem ter issues. Mitigação: o build de validação vai evidenciar qualquer problema antes de avançar.
- **Sem banco real no setup inicial:** O cliente Drizzle requer DATABASE_URL para funcionar em runtime. Para que o build passe sem banco, a string de conexão pode ser um placeholder em .env durante desenvolvimento local. A documentação em .env.example deixa isso claro.
- **Windows como ambiente de dev:** Algumas ferramentas (drizzle-kit, next) têm comportamentos distintos em Windows. Caminhos serão mantidos com / via configuração.

## Migration Plan

Este é o estado inicial do projeto — não há estado anterior a migrar.

Ordem de execução das tasks:
1. Git init
2. 
px create-next-app@latest com flags corretas
3. Instalar dependências adicionais (drizzle-orm, postgres, better-auth, zod)
4. Configurar shadcn/ui (
px shadcn@latest init)
5. Criar estrutura de pastas (src/lib, src/db/schema, src/modules, docs)
6. Escrever src/lib/db.ts, src/lib/auth.ts, src/db/schema/index.ts
7. Criar .env.example e docs/DECISIONS.md
8. Validar: typecheck, lint, build
9. Commit inicial
