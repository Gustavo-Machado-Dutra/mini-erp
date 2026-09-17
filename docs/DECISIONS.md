# Decisoes Arquiteturais — RevenueFlow

> Formato: Problema → Alternativas → Decisao → Motivo → Consequencias

---

## ADR-001: Monolito modular com Next.js

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Definir a arquitetura inicial do RevenueFlow: como organizar o codigo de forma que seja simples agora, mas permita crescimento ordenado.

### Alternativas

1. **Microservices**: escalabilidade alta, mas complexidade operacional enorme para um MVP sem usuarios.
2. **Next.js + backend separado (NestJS/Fastify)**: mais flexivel, mas duplica a superficie de infra e adiciona latencia de rede desnecessaria.
3. **Monolito modular com Next.js**: tudo dentro de um projeto Next.js, separado por modulos de dominio em src/modules/.

### Decisao

Monolito modular com Next.js 15 (App Router). O backend vive dentro do Next.js usando Server Actions e Route Handlers. O banco e acessado via Drizzle ORM. Autenticacao via Better Auth.

### Motivo

- O spec.md define explicitamente esta arquitetura.
- O MVP nao vai a producao — nao ha justificativa para complexidade operacional.
- Server Components + Server Actions eliminam a necessidade de uma API REST separada para a maioria dos casos.
- A separacao por modulos em src/modules/ permite extrair servicos no futuro sem reescrever tudo.

### Consequencias

- Toda a logica de negocio fica no mesmo repositorio e processo — facil de desenvolver e debugar.
- Escalar horizontalmente exige cuidado com estado local (sem estado local relevante no MVP).
- Se o produto crescer muito, a migração para servicos sera feita modulo por modulo.

---

## ADR-002: Drizzle ORM com PostgreSQL

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Escolher ORM/query builder para acesso ao PostgreSQL.

### Alternativas

1. **Prisma**: mais popular, mas gera codigo em runtime, tem um client pesado e usa um schema DSL proprio.
2. **Drizzle ORM**: type-safe, schema em TypeScript puro, sem geração em runtime, leve.
3. **SQL puro**: maximo controle, mas sem type-safety e propenso a SQL injection sem disciplina.

### Decisao

Drizzle ORM.

### Motivo

- Especificado no spec.md e context.md.
- Schema em TypeScript: o banco e o codigo ficam sincronizados via tipos.
- Nao gera codigo em runtime — sem surpresas no build.
- drizzle-kit gera migrations de forma controlada.

### Consequencias

- Migrations devem ser geradas explicitamente com 
px drizzle-kit generate.
- O schema TypeScript e a fonte de verdade do banco — qualquer alteração no banco passa pelo schema.

---

## ADR-003: Better Auth para autenticação e sessao

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Escolher sistema de autenticacao compativel com Next.js 15, multi-tenant, que integre com Drizzle.

### Alternativas

1. **NextAuth v5 (Auth.js)**: popular, mas configuracao complexa para multi-tenant; adapter Drizzle e mais limitado.
2. **Better Auth**: projetado para Next.js moderno, tem adapter Drizzle nativo, organizations plugin, e API type-safe.
3. **Implementacao propria**: controle total, mas risco de seguranca alto e tempo de desenvolvimento alto.

### Decisao

Better Auth.

### Motivo

- Especificado no spec.md.
- Organizations plugin do Better Auth implementa multi-tenancy de forma nativa — alinha direto com o requisito de isolamento de tenants.
- Adapter Drizzle oficial — schema do banco e gerado automaticamente.
- Nao exige PostgreSQL/Supabase como backend — roda no servidor Next.js.

### Consequencias

- A configuração de providers (Google, GitHub, email) sera feita na Fase 2.
- O schema do banco (tabelas de users, sessions, organizations, members) sera gerado pelo Better Auth na Fase 2 quando a migracao for executada.

---

## ADR-004: shadcn/ui como biblioteca de componentes

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Escolher biblioteca de componentes UI para o frontend.

### Alternativas

1. **MUI (Material UI)**: rica em componentes, mas opinada no estilo e pesada.
2. **Radix UI puro**: primitivas acessiveis, mas exige estilizacao manual de tudo.
3. **shadcn/ui**: componentes copiados para o projeto (voce e o dono do codigo), construidos sobre Radix UI + Tailwind.

### Decisao

shadcn/ui.

### Motivo

- Especificado no spec.md e context.md.
- Os componentes sao codigo do projeto — sem lock-in de dependencia.
- Integração nativa com Tailwind CSS.
- Acessibilidade via Radix UI.
- Facil customizacao sem overrides CSS complexos.

### Consequencias

- Componentes sao adicionados sob demanda via 
px shadcn add <component>.
- O estilo padrao pode ser customizado editando diretamente os arquivos em src/components/ui/.
