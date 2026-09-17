---
# 0. Estado Atual do Desenvolvimento

**Data da última atualização:** 2026-09-17
**Fase concluída:** Fase 1 — Foundation
**Próxima fase:** Fase 2 — Auth completa (Better Auth + esquema de banco + login/logout)

## O que foi implementado

- [x] Git inicializado (branch: master, commit inicial: 70ee6b5)
- [x] Next.js 15.5 com App Router, TypeScript strict, Tailwind CSS v3, shadcn/ui (estrutura)
- [x] Drizzle ORM configurado (src/lib/db.ts) — schema vazio, aguardando Fase 2
- [x] Better Auth instalado e configurado (src/lib/auth.ts) — sem providers ainda
- [x] Route handler Better Auth (src/app/api/auth/[...all]/route.ts)
- [x] Zod instalado
- [x] Estrutura de pastas: src/app, src/lib, src/db/schema, src/db/migrations, src/modules, src/components/ui
- [x] .env.example com DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL
- [x] docs/DECISIONS.md — ADR-001 a ADR-004
- [x] OpenSpec change oundation-setup documentada (4/4 artefatos)

## Validações executadas

- TypeScript: PASS (tsc --noEmit sem erros)
- Lint: PASS (ESLint sem erros)
- Build: PASS com aviso (build completa, .next/ gerado; Better Auth loga aviso de schema mismatch porque o banco PostgreSQL não existe ainda — esperado e resolve-se na Fase 2 ao criar o banco e rodar migrations)

## O que ainda não existe

- Banco PostgreSQL real (DATABASE_URL é placeholder)
- Schema do banco (tabelas auth, organizations, members, etc.)
- Login/logout funcional
- Qualquer página além do placeholder /
- Testes E2E

---
# RevenueFlow — CONTEXT

> Memória operacional condensada do projeto.
>
> **Fonte de verdade funcional e arquitetural:** `SPEC.md`.
>
> Este arquivo não substitui o SPEC. Ele existe para permitir que agentes e novas sessões entendam rapidamente o estado, as decisões e o modo de trabalho atual.

---

# 1. Projeto

**Nome:** RevenueFlow

**Tipo:** SaaS B2B MVP

**Objetivo:** ajudar empresas de serviços a recuperar vendas, clientes e agendamentos perdidos por meio de acompanhamento de leads, pipeline, follow-ups e métricas financeiras.

**Nicho inicial:** clínicas de estética.

**Arquitetura de domínio:** genérica para negócios de serviços.

---

# 2. Objetivo Atual

Construir rapidamente um MVP funcional para validar o core do produto.

O MVP NÃO será colocado em produção.

Não antecipar infraestrutura de escala.

O foco atual é:

```text
Auth
→ Organization
→ Membership
→ RLS
→ Customers
→ Leads
→ Pipeline
→ Services
→ Professionals
→ Appointments
→ Follow-ups
→ Conversions
→ Revenue
→ Dashboard
```

---

# 3. Stack Oficial

Usar somente as tecnologias necessárias:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui

PostgreSQL
Drizzle ORM
Better Auth

Zod
React Hook Form

Playwright
ESLint
```

## Não adicionar sem necessidade

```text
NestJS
Fastify
Prisma
Drizzle
Redis
Kafka
Kubernetes
microservices
GraphQL
TanStack Query globalmente
IA
WhatsApp
Instagram
Meta
Stripe
Mercado Pago
workers
queues
automation engine
vector DB
```

---

# 4. Arquitetura Atual

Monólito modular simples:

```text
Browser
 ↓
Next.js
 ├─ Server Components
 ├─ Client Components quando necessário
 ├─ Server Actions
 └─ Route Handlers quando necessários
 ↓
PostgreSQL
 ├─ Auth
 └─ PostgreSQL + RLS
```

Não criar backend separado.

Não criar ORM.

---

# 5. Fonte de Verdade

## SPEC.md

Define:

- visão;
- requisitos;
- domínio;
- arquitetura;
- segurança;
- banco;
- MVP;
- roadmap;
- regras.

## context.md

Define:

- estado operacional;
- decisões resumidas;
- regras de trabalho;
- contexto rápido para agentes.

## DESIGN

Se um documento visual for adicionado posteriormente, ele será a fonte de verdade visual.

---

# 6. Multi-Tenancy

Regra crítica:

> Usuários de uma organização nunca podem acessar dados de outra organização.

Modelo:

```text
auth.users
 ↓
profiles
 ↓
organization_members
 ↓
organizations
```

Dados empresariais têm `organization_id` quando aplicável.

RLS é obrigatório.

Não confiar somente em:

```text
.eq("organization_id", ...)
```

O browser não define autorização.

O servidor verifica membership.

O PostgreSQL/RLS impõe isolamento.

---

# 7. Roles

Roles iniciais:

```text
platform_admin
organization_owner
organization_admin
professional
```

RBAC granular não será implementado agora.

`platform_admin` é conceito separado dos administradores dos tenants.

---

# 8. Entidades MVP

Principais:

```text
profiles
organizations
organization_members

customers

professionals
services
appointments

leads
opportunities

follow_ups

conversions
revenue_events
```

Evitar criar tabelas prematuramente.

Fora do MVP:

```text
conversations
messages
automations
automation_runs
integrations
audit_logs
billing
subscriptions
campaigns
```

---

# 9. Pipeline

Estágios iniciais:

```text
new
contacted
interested
scheduled
won
lost
```

Não criar tabelas separadas para cada estágio.

Usar `opportunities`.

---

# 10. Follow-ups

Inicialmente são manuais.

Modelo conceitual:

```text
lead/customer/opportunity
 ↓
follow_up
 ↓
scheduled_at
 ↓
execution
 ↓
outcome
```

Futuro:

```text
manual
→ automatic
→ AI
→ WhatsApp
```

Não implementar engine agora.

---

# 11. Revenue Attribution

Não declarar automaticamente toda receita como recuperada.

Separar:

```text
Revenue registered
```

de:

```text
Revenue attributed/recovered
```

Attribution inicial:

```text
direct_conversion
follow_up_conversion
reactivation_conversion
manual_conversion
unknown
```

O MVP pode registrar attribution manualmente.

---

# 12. Dashboard

Prioridade:

```text
Revenue recovered
Conversions
Leads
Appointments
Follow-ups
Conversion rate
```

Também:

- receita total x recuperada;
- pipeline;
- follow-ups hoje/atrasados/próximos;
- atividades recentes.

Não criar dashboard excessivamente complexo.

---

# 13. Desenvolvimento

Desenvolver por fases.

Ordem atual:

```text
Fase 0
Arquitetura + documentação

Fase 1
Next.js foundation

Fase 2
Better Auth

Fase 3
Multi-tenancy + RLS

Fase 4
Layout

Fase 5
Customers

Fase 6
Leads + Pipeline

Fase 7
Services + Professionals + Appointments

Fase 8
Follow-ups

Fase 9
Conversions + Revenue

Fase 10
Dashboard

Fase 11
E2E
```

Não avançar várias fases sem validar a fundação.

---

# 14. TLC Spec-Driven Development

**TLC é responsável pelo planejamento e execução do desenvolvimento.**

Fluxo:

```text
Requisito
 ↓
TLC
 ↓
Planejamento
 ↓
Tasks
 ↓
Implementação
 ↓
Testes
 ↓
Validação
```

Usar TLC para:

- decomposição;
- planejamento;
- ordem de implementação;
- critérios de aceitação;
- execução;
- validação.

Antes de implementar uma alteração relevante, o agente deve entender o SPEC e criar um plano TLC adequado.

---

# 15. OpenSpec

**OpenSpec é exclusivamente documentação de mudanças.**

Não usar OpenSpec como segundo sistema de planejamento.

Separação:

```text
SPEC
= O que o produto deve ser

TLC
= Como planejar/executar

OpenSpec
= Como documentar mudanças
```

Para mudanças pequenas:

```text
TLC
→ task
→ implementação
→ teste
```

Para mudanças significativas:

```text
TLC
→ planejamento
→ OpenSpec documenta a mudança
→ implementação
→ testes
→ documentação
```

Evitar duplicação entre SPEC, context e OpenSpec.

---

# 16. Segurança

Antes de considerar qualquer funcionalidade de dados concluída:

- autenticação verificada;
- membership verificado;
- autorização server-side;
- RLS revisado;
- foreign keys revisadas;
- validação Zod;
- nenhum secret no cliente.

Nunca expor:

```text
SUPABASE_SERVICE_ROLE_KEY
```

no browser.

---

# 17. Banco

Migrations SQL versionadas.

Princípios:

- UUID;
- timestamps com timezone;
- numeric para dinheiro;
- foreign keys;
- constraints;
- índices somente quando necessários;
- sem soft delete por padrão.

Nunca resolver regra de segurança exclusivamente no frontend.

---

# 18. Testes

Playwright para E2E.

Prioridade máxima:

```text
Tenant isolation
```

Teste obrigatório:

```text
Tenant A
X
Tenant B
```

Também testar:

- login;
- signup;
- organização;
- cliente;
- lead;
- pipeline;
- agendamento;
- follow-up;
- conversão;
- dashboard.

Testes unitários apenas para regras relevantes.

---

# 19. Validação

Antes de marcar uma tarefa como concluída, executar quando aplicável:

```text
typecheck
lint
tests
build
E2E
```

Nunca declarar uma validação como concluída sem executá-la.

Se algo não puder ser executado, registrar explicitamente.

---

# 20. Git

Commits pequenos.

Padrão:

```text
feat: ...
fix: ...
test: ...
refactor: ...
docs: ...
```

Antes de mudanças importantes:

```text
git status
git branch
```

Não apagar trabalho existente sem analisar.

---

# 21. Regra de Desenvolvimento

Não implementar funcionalidades futuras apenas porque foram mencionadas.

Exemplo:

O SPEC menciona WhatsApp, IA e automações como evolução futura.

Isso NÃO significa implementar:

```text
WhatsApp
LLM
queue
worker
automation engine
```

agora.

Implementar somente o necessário para o MVP.

---

# 22. Próxima Ação

A próxima etapa objetiva é:

**Fase 0 — Fundação**

1. verificar se o diretório do projeto já existe;
2. verificar Git;
3. criar/ajustar documentação;
4. validar a stack;
5. preparar estrutura inicial;
6. definir banco inicial;
7. preparar estratégia de Better Auth;
8. preparar tenant authorization;
9. só então iniciar implementação do Next.js.

Nenhuma feature comercial deve ser implementada antes da fundação ser validada.

---

# 23. Regra de Ouro

> **RevenueFlow é um MVP.**
>
> Use a menor quantidade de tecnologia capaz de entregar o requisito corretamente.
>
> Segurança multi-tenant é obrigatória.
>
> Escalabilidade prematura não é.
>
> TLC planeja e executa.
>
> OpenSpec documenta mudanças.
>
> SPEC define a verdade do produto.


# Backend Contract

Stack obrigatória do backend:

```text
Next.js Server
Server Actions
Route Handlers
Better Auth
Zod
Drizzle ORM
PostgreSQL
```

Responsabilidades:

- Better Auth: autenticação e sessão;
- Zod: validação de entrada;
- Server Actions: mutações internas;
- Route Handlers: HTTP/webhooks quando necessários;
- Drizzle: acesso ao PostgreSQL;
- PostgreSQL: fonte de verdade dos dados.

Fluxo padrão:

```text
Request
 ↓
Auth
 ↓
Validation
 ↓
Authorization
 ↓
Business rule
 ↓
Database
```

O frontend nunca deve acessar PostgreSQL diretamente.
