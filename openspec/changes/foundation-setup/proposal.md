# Proposal

## Why

O RevenueFlow não possui nenhum código ainda. Para que qualquer funcionalidade de domínio
possa ser desenvolvida com segurança, é necessário estabelecer a fundação técnica completa:
framework, banco de dados, autenticação, qualidade de código e estrutura de pastas.
Esta mudança cria essa fundação — a Fase 1 do roadmap definido no spec.md.

## What Changes

- Inicializar repositório Git com commit inicial
- Criar aplicação Next.js 15 com App Router, TypeScript strict e Tailwind CSS
- Instalar e configurar shadcn/ui como biblioteca de componentes
- Configurar ESLint com regras adequadas para Next.js + TypeScript
- Instalar Drizzle ORM e drizzle-kit; criar cliente de banco PostgreSQL
- Instalar Better Auth e configurar instância do servidor
- Instalar Zod para validação server-side
- Definir estrutura de diretórios do monólito modular (src/app, src/lib, src/db, src/modules)
- Criar .env.example documentando variáveis obrigatórias (sem valores reais)
- Criar docs/DECISIONS.md com a decisão arquitetural da fundação
- Validar a fundação: typecheck, lint, build

## Capabilities

### New Capabilities

- oundation/project-setup: A aplicação Next.js existe, compila sem erros, com TypeScript strict, Tailwind e shadcn/ui configurados
- oundation/database-access: Drizzle ORM conecta ao PostgreSQL com esquema mínimo e cliente type-safe
- oundation/auth-bootstrap: Better Auth está instalado e configurado; instância do servidor pronta para receber a configuração de providers

### Modified Capabilities

<!-- Nenhuma — projeto vazio, sem specs existentes -->

## Impact

- Arquivos criados: package.json, tsconfig.json, next.config.ts, tailwind.config.ts, eslint.config.mjs, src/app/layout.tsx, src/app/page.tsx, src/lib/db.ts, src/lib/auth.ts, src/db/schema/index.ts, .env.example, docs/DECISIONS.md
- Dependências adicionadas: next, react, typescript, tailwindcss, drizzle-orm, drizzle-kit, better-auth, zod, @neondatabase/serverless, shadcn/ui e relacionados
- Sem breaking changes (projeto vazio)
- Sem impacto em APIs externas
