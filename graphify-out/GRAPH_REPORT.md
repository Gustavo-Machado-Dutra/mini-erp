# Graph Report - mini-erp  (2026-10-09)

## Corpus Check
- 235 files · ~103,158 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 6, .example 1, .log 1)

## Summary
- 1463 nodes · 3265 edges · 129 communities (99 shown, 30 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `08140a64`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- context.md
- spec.md
- 20. Roadmap do MVP
- 8. Domínio
- openspec-explore/SKILL.md
- Decisions
- ADDED Requirements
- 14. Banco de Dados
- tasks.md
- ADDED Requirements
- ADDED Requirements
- 3. Princípios do Projeto
- package.json
- proposal.md
- 19.1 E2E
- 22. OpenSpec + TLC Spec-Driven Development
- ADR-001: Monolito modular com Next.js
- 10. Receita e Attribution
- tenancy/actions.ts
- compilerOptions
- AGENTS.md
- requireSession
- dependencies
- operations-isolation.test.ts
- devDependencies
- header.tsx
- ADDED Requirements
- Requirements
- customers.ts
- Tasks
- ADR-008: Modelo Unificado de Leads e Pipeline no MVP
- ADDED Requirements
- Requirements
- ADDED Requirements
- Tasks
- Requirements
- Decisions
- leads/actions.ts
- Proposal
- 4. Stack Oficial do MVP
- dashboard.test.ts
- scripts
- utils.ts
- middleware.ts
- 6. Multi-Tenancy
- 11. Dashboard
- 7. Perfis e Autorização
- use-toast.ts
- 1. Visão do Produto
- 5. Arquitetura
- Button
- 0. Estado Atual do Desenvolvimento
- 5. Fonte de Verdade
- follow-ups/actions.ts
- 0. Estado Atual do Desenvolvimento
- 0. Estado Atual do Desenvolvimento
- lead-isolation.test.ts
- lead-form.tsx
- components.json
- Customer
- next
- 0. Estado Atual do Desenvolvimento
- 0. Estado Atual do Desenvolvimento
- 0. Estado Atual do Desenvolvimento
- updateLeadStageAction
- 3. Stack Oficial
- customers/queries.ts
- Requirements
- Requirements
- eslint.config.mjs
- Requirements
- Tasks
- Requirements
- requireOrganizationForPage
- ADR-002: Drizzle ORM com PostgreSQL
- ADR-003: Better Auth para autenticaÃƒÂ§ÃƒÂ£o e sessao
- ADR-004: shadcn/ui como biblioteca de componentes
- ADR-005: Nao utilizar o plugin Organizations do Better Auth
- ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side
- ADR-007: AusÃƒÂªncia de exclusÃƒÂ£o fÃƒÂ­sica de Customers na Fase 5
- ADR-009: Gestão Operacional de Serviços, Profissionais e Agendamentos no MVP
- Proposal: Customer Management Domain
- Proposal: Leads & Commercial Pipeline Domain
- Spec: Services, Professionals & Appointments Operations
- revenue/new/page.tsx
- Spec: Services, Professionals & Appointments Operations
- Decisoes Arquiteturais Ã¢â‚¬â€ RevenueFlow
- cn
- toast.tsx
- 0. Estado Atual do Desenvolvimento
- follow-ups/page.tsx
- ADR-010: Gestão Manual de Follow-ups e Registro de Desfecho no MVP
- @playwright/test
- Design
- Spec: Follow-ups Management
- Spec: Follow-ups Management
- diagnose.js
- 0. Estado Atual do Desenvolvimento
- dialog.tsx
- 2026-09-17-e2e-testing/design.md
- 2026-09-17-e2e-testing/proposal.md
- 2026-09-17-e2e-testing/specs/e2e/spec.md
- 2026-09-17-e2e-testing/tasks.md
- conversions-revenue/proposal.md
- conversions-revenue/spec.md
- tailwindcss
- dashboard/design.md
- dashboard/proposal.md
- dashboard/spec.md
- openspec/specs/e2e/spec.md
- conversion-isolation.test.ts
- conversions/[id]/page.tsx
- Design
- Proposal
- Melhorias da interface e pendências de alinhamento
- Tasks
- Proposal: Follow-ups Domain & Activity Management
- mini-erp

## God Nodes (most connected - your core abstractions)
1. `requireSession()` - 108 edges
2. `Button` - 75 edges
3. `cn()` - 73 edges
4. `next` - 67 edges
5. `requireOrganization()` - 66 edges
6. `requireOrganizationForPage()` - 64 edges
7. `lucide-react` - 40 edges
8. `Input` - 32 edges
9. `drizzle-orm` - 31 edges
10. `react` - 30 edges

## Surprising Connections (you probably didn't know these)
- `AppShell como Server Component Wrapper` --references--> `AppShell()`  [INFERRED]
  openspec/changes/archive/2026-09-17-app-shell-navigation/design.md → src/components/layout/app-shell.tsx
- `3. Integração de Layout` --references--> `AppShell()`  [INFERRED]
  openspec/changes/archive/2026-09-17-app-shell-navigation/tasks.md → src/components/layout/app-shell.tsx
- `What Changes` --references--> `Sidebar()`  [INFERRED]
  openspec/changes/archive/2026-09-17-follow-ups/proposal.md → src/components/layout/sidebar.tsx
- `ConsequÃªncias` --references--> `updateLeadStageAction()`  [INFERRED]
  docs/DECISIONS.md → src/modules/leads/actions.ts
- `Decisao` --references--> `requireSession()`  [INFERRED]
  docs/DECISIONS.md → src/modules/tenancy/context.ts

## Import Cycles
- None detected.

## Communities (129 total, 30 thin omitted)

### Community 0 - "context.md"
Cohesion: 0.08
Nodes (23): 10. Follow-ups, 11. Revenue Attribution, 12. Dashboard, 13. Desenvolvimento, 14. TLC Spec-Driven Development, 15. OpenSpec, 16. SeguranÃƒÆ’Ã‚Â§a, 17. Banco (+15 more)

### Community 1 - "spec.md"
Cohesion: 0.12
Nodes (16): 12.1 UX, 12. Interface, 13. Validação, 15. Estrutura do Projeto, 16.1 DECISIONS.md, 16. Documentação, 17. Git, 18. Ambientes (+8 more)

### Community 2 - "20. Roadmap do MVP"
Cohesion: 0.15
Nodes (13): 20. Roadmap do MVP, Fase 0 — Especificação e Fundação, Fase 10 — Dashboard, Fase 11 — E2E, Fase 1 — Next.js, Fase 2 — PostgreSQL/Better Auth Auth, Fase 3 — Multi-tenancy, Fase 4 — Layout (+5 more)

### Community 3 - "8. Domínio"
Cohesion: 0.15
Nodes (13): 8.10 Follow-ups, 8.11 Conversions, 8.12 Revenue Events, 8.1 Organizations, 8.2 Profiles, 8.3 Organization Members, 8.4 Customers, 8.5 Professionals (+5 more)

### Community 4 - "openspec-explore/SKILL.md"
Cohesion: 0.17
Nodes (11): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+3 more)

### Community 5 - "Decisions"
Cohesion: 0.17
Nodes (11): Better Auth, Context, Decisions, Drizzle ORM com PostgreSQL, Estrutura de diretórios, Goals / Non-Goals, Migration Plan, Next.js 15 com App Router (+3 more)

### Community 6 - "ADDED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Aplicação Next.js inicializada, Requirement: ESLint configurado, Requirement: shadcn/ui disponível, Requirement: Tailwind CSS configurado, Scenario: Build sem erros de compilação, Scenario: Classes Tailwind aplicadas (+3 more)

### Community 7 - "14. Banco de Dados"
Cohesion: 0.17
Nodes (12): 14.10 Migrations, 14.1 PostgreSQL, 14.2 Drizzle ORM, 14.3 Identificadores, 14.3 Identificadores, 14.4 Timestamps, 14.5 Valores monetários, 14.6 Foreign Keys (+4 more)

### Community 8 - "tasks.md"
Cohesion: 0.18
Nodes (10): 10. Commit Inicial, 1. Repositório Git, 2. Aplicação Next.js, 3. Dependências de Backend, 4. Estrutura de Diretórios, 5. Configuração do Banco (Drizzle), 6. Configuração do Better Auth, 7. Variáveis de Ambiente (+2 more)

### Community 9 - "ADDED Requirements"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Purpose, Requirement: Cliente Drizzle disponível para uso server-side, Requirement: Schema Drizzle definido e exportado, Requirement: Variáveis de ambiente de banco documentadas, Scenario: Cliente não acessível no cliente browser, Scenario: .env.example presente e completo, Scenario: Importação do cliente de banco (+1 more)

### Community 10 - "ADDED Requirements"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Purpose, Requirement: Instância Better Auth configurada no servidor, Requirement: Variáveis de ambiente de auth documentadas, Scenario: .env.example documenta todas as variáveis de auth, Scenario: Módulo de auth importável sem erros, Scenario: Secrets de auth não expostos ao cliente

### Community 11 - "3. Princípios do Projeto"
Cohesion: 0.25
Nodes (8): 3.1 Simplicidade, 3.2 Segurança, 3.3 Evolução sem overengineering, 3.4 Banco como fonte de verdade, 3.5 Server-side first, 3.6 Não confiar no cliente, 3.7 Mudanças pequenas, 3. Princípios do Projeto

### Community 12 - "package.json"
Cohesion: 0.10
Nodes (18): name, private, version, autoprefixer, drizzle-kit, eslint, eslint-config-next, postcss (+10 more)

### Community 13 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 14 - "19.1 E2E"
Cohesion: 0.29
Nodes (7): 19.1 E2E, 19.2 Domínio, 19.3 Validação, 19. Testes, Auth, Organizations, Tenant isolation

### Community 15 - "22. OpenSpec + TLC Spec-Driven Development"
Cohesion: 0.29
Nodes (7): 22.1 TLC Spec-Driven Development, 22.2 OpenSpec, 22.3 Regra de separação, 22.4 Mudanças pequenas, 22.5 Mudanças significativas, 22.6 Regra contra duplicação, 22. OpenSpec + TLC Spec-Driven Development

### Community 16 - "ADR-001: Monolito modular com Next.js"
Cohesion: 0.33
Nodes (6): ADR-001: Monolito modular com Next.js, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 17 - "10. Receita e Attribution"
Cohesion: 0.40
Nodes (5): 10.1 Receita registrada, 10.2 Attribution, 10.3 Regra inicial, 10.4 Métricas, 10. Receita e Attribution

### Community 18 - "tenancy/actions.ts"
Cohesion: 0.06
Nodes (38): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why, 1. Schema Drizzle de Tenancy (+30 more)

### Community 19 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 26 - "requireSession"
Cohesion: 0.13
Nodes (27): O que foi implementado na Fase 7, EditProfessionalPage(), EditProfessionalPageProps, ProfessionalDetailPage(), ProfessionalDetailPageProps, NewProfessionalPage(), ProfessionalForm(), getSession() (+19 more)

### Community 27 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, better-auth, class-variance-authority, clsx, drizzle-orm, lucide-react, next, postgres (+11 more)

### Community 28 - "operations-isolation.test.ts"
Cohesion: 0.07
Nodes (34): Architecture & Data Flow, Design: Services, Professionals & Appointments, Non-goals, Proposal: Services, Professionals & Appointments Operations, What Changes, Why, AppointmentFormData, StatusBadgeProps (+26 more)

### Community 29 - "devDependencies"
Cohesion: 0.14
Nodes (14): devDependencies, autoprefixer, drizzle-kit, eslint, eslint-config-next, @eslint/eslintrc, @playwright/test, postcss (+6 more)

### Community 30 - "header.tsx"
Cohesion: 0.16
Nodes (14): Goals / Non-Goals, What Changes, 2. Componentes de UI, OrgSwitcher(), ProtectedLayout(), AppShell(), Header(), groups (+6 more)

### Community 31 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Purpose, Requirement: Cadastro com email e senha, Requirement: Login com email e senha, Requirement: Logout, Requirement: Protecao de rotas, Requirement: Sessao segura, Scenario: Acesso autenticado a rota protegida (+10 more)

### Community 32 - "Requirements"
Cohesion: 0.11
Nodes (18): auth/email-password Specification, Purpose, Requirement: Cadastro com email e senha, Requirement: Login com email e senha, Requirement: Logout, Requirement: Protecao de rotas, Requirement: Sessao segura, Requirements (+10 more)

### Community 33 - "customers.ts"
Cohesion: 0.06
Nodes (66): ADR-011: Schema de Conversões e Receita alinhado à SPEC + regra de atribuição do MVP, Alternativas, Consequências, Decisão, Motivo, Problema, Design: Conversions & Revenue, better-auth (+58 more)

### Community 34 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Schema Drizzle & Migrations, 2. Dominio, Validacao Zod & Tipos, 4. Interface Web (App Router), 5. Testes Automatizados e Seguranca, 6. Documentacao e Validacoes, Tasks

### Community 35 - "ADR-008: Modelo Unificado de Leads e Pipeline no MVP"
Cohesion: 0.33
Nodes (6): ADR-008: Modelo Unificado de Leads e Pipeline no MVP, Alternativas, ConsequÃªncias, DecisÃ£o, Motivo, Problema

### Community 37 - "ADDED Requirements"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Autorizacao Baseada em Papeis (Roles), Requirement: Criacao de Organizacao Transacional, Requirement: Isolamento e Validacao de Membership, Requirement: Tenant Context Server-Side, Scenario: Acao exclusiva de owner executada por member, Scenario: Acesso negado a organizacao de terceiros (IDOR Prevention) (+5 more)

### Community 38 - "Requirements"
Cohesion: 0.14
Nodes (13): Purpose, Requirement: Autorizacao Baseada em Papeis (Roles), Requirement: Criacao de Organizacao Transacional, Requirement: Isolamento e Validacao de Membership, Requirement: Tenant Context Server-Side, Requirements, Scenario: Acao exclusiva de owner executada por member, Scenario: Acesso negado a organizacao de terceiros (IDOR Prevention) (+5 more)

### Community 39 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Indicador de rota atual, Requirement: Layout estrutural consistente (App Shell), Requirement: Navegação responsiva, Scenario: Estado ativo de navegação, Scenario: Estrutura inicial carregada, Scenario: Navegador Desktop (+2 more)

### Community 40 - "Tasks"
Cohesion: 0.18
Nodes (10): 1. Correcoes da Fase 1, 2. Schema do Banco, 3. Better Auth Config, 4. Sessao Server-Side, 5. Middleware, 6. Paginas de Auth, 7. Pagina Protegida, 8. Documentacao (+2 more)

### Community 41 - "Requirements"
Cohesion: 0.18
Nodes (10): layout/app-shell Specification, Purpose, Requirement: Indicador de rota atual, Requirement: Layout estrutural consistente (App Shell), Requirement: Navegação responsiva, Requirements, Scenario: Estado ativo de navegação, Scenario: Estrutura inicial carregada (+2 more)

### Community 42 - "Decisions"
Cohesion: 0.20
Nodes (9): Context, Decisions, Design, Goals / Non-Goals, Layout groups para separar rotas publicas e protegidas, Middleware para protecao de rotas, Nao usar Organizations plugin do Better Auth, Risks / Trade-offs (+1 more)

### Community 43 - "leads/actions.ts"
Cohesion: 0.29
Nodes (8): CreateLeadData, CreateLeadInput, createLeadSchema, UpdateLeadData, UpdateLeadInput, updateLeadSchema, UpdateLeadStageInput, updateLeadStageSchema

### Community 44 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 45 - "4. Stack Oficial do MVP"
Cohesion: 0.25
Nodes (8): 4.1 Framework, 4.2 UI, 4.3 Backend/Data, 4.4 Validação, 4.5 Testes, 4.6 Qualidade, 4.7 Não utilizar inicialmente, 4. Stack Oficial do MVP

### Community 46 - "dashboard.test.ts"
Cohesion: 0.20
Nodes (7): Notas da execução (2026-09-25), isRecoveredAttributionType(), DashboardDomainEngine, MockConversion, MockCustomer, MockFollowUp, MockRevenue

### Community 47 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, lint, start, test, test:e2e, typecheck

### Community 48 - "utils.ts"
Cohesion: 0.17
Nodes (9): class-variance-authority, clsx, @radix-ui/react-separator, tailwind-merge, Badge(), BadgeProps, badgeVariants, Separator (+1 more)

### Community 49 - "middleware.ts"
Cohesion: 0.40
Nodes (3): config, guestOnlyRoutes, protectedRoutes

### Community 50 - "6. Multi-Tenancy"
Cohesion: 0.33
Nodes (6): 6.1 Modelo, 6.2 Membership, 6.3 Organização atual, 6.4 Isolamento no banco, 6.5 Secrets e acesso ao banco, 6. Multi-Tenancy

### Community 51 - "11. Dashboard"
Cohesion: 0.40
Nodes (5): 11.1 Gráfico, 11.2 Pipeline, 11.3 Follow-ups, 11.4 Atividades recentes, 11. Dashboard

### Community 52 - "7. Perfis e Autorização"
Cohesion: 0.40
Nodes (5): 7.1 Platform Admin, 7.2 Organization Owner, 7.3 Organization Admin, 7.4 Professional, 7. Perfis e Autorização

### Community 53 - "use-toast.ts"
Cohesion: 0.17
Nodes (15): ToastActionElement, ToastProps, Action, ActionType, addToRemoveQueue(), dispatch(), genId(), listeners (+7 more)

### Community 54 - "1. Visão do Produto"
Cohesion: 0.50
Nodes (4): 1.1 Nome, 1.2 Proposta, 1.3 Nicho inicial, 1. Visão do Produto

### Community 55 - "5. Arquitetura"
Cohesion: 0.50
Nodes (4): 5.1 Server Components, 5.2 Client Components, 5.3 Server Actions, 5. Arquitetura

### Community 56 - "Button"
Cohesion: 0.19
Nodes (19): ConversionForm(), NewConversionPage(), FollowUpForm(), EditFollowUpPage(), EditFollowUpPageProps, NewFollowUpPage(), LeadDetailPage(), LeadDetailPageProps (+11 more)

### Community 57 - "0. Estado Atual do Desenvolvimento"
Cohesion: 0.50
Nodes (4): 0. Estado Atual do Desenvolvimento, O que ainda nÃƒÆ’Ã‚Â£o existe, O que foi implementado, ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes executadas

### Community 58 - "5. Fonte de Verdade"
Cohesion: 0.50
Nodes (3): 5. Fonte de Verdade, DESIGN, SPEC.md

### Community 59 - "follow-ups/actions.ts"
Cohesion: 0.06
Nodes (49): O que foi implementado na Fase 8, Architecture & Data Flow, Design: Follow-ups Domain, 1. Schema Drizzle & Migrations, 2. Modulo de Dominio, Zod & Tipos, 3. Interface Web (App Router), 4. Testes Automatizados & Seguranca, 5. Documentacao & Validacoes (+41 more)

### Community 61 - "0. Estado Atual do Desenvolvimento"
Cohesion: 0.67
Nodes (3): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 13, Validações

### Community 62 - "0. Estado Atual do Desenvolvimento"
Cohesion: 0.67
Nodes (3): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 11, Validações

### Community 63 - "lead-isolation.test.ts"
Cohesion: 0.34
Nodes (5): Lead, LeadDomainEngine, MockMembership, MockOrganization, MockUser

### Community 64 - "lead-form.tsx"
Cohesion: 0.15
Nodes (18): COMMON_SOURCES, CustomerOption, LeadFormData, LeadFormProps, PipelineViewProps, StageBadgeProps, StageSelectProps, LeadStage (+10 more)

### Community 65 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 66 - "Customer"
Cohesion: 0.08
Nodes (29): O que foi implementado na Fase 5, Architecture & Data Flow, Design: Customer Management Domain, 1. Schema Drizzle & Migrations, 2. Dominio, Validacao Zod & Tipos, 3. Consultas e Mutacoes Server-Side, 4. Interface Web (App Router), 5. Testes Automatizados e Seguranca (+21 more)

### Community 67 - "next"
Cohesion: 0.12
Nodes (27): next, react, LoginPage(), RegisterPage(), registerSchema, AppointmentFormProps, CustomerOption, ProfessionalOption (+19 more)

### Community 68 - "0. Estado Atual do Desenvolvimento"
Cohesion: 0.67
Nodes (3): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 3, ValidaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes

### Community 69 - "0. Estado Atual do Desenvolvimento"
Cohesion: 0.67
Nodes (3): 0. Estado Atual do Desenvolvimento, O que ainda nÃƒÆ’Ã‚Â£o existe, O que foi implementado na Fase 2

### Community 71 - "updateLeadStageAction"
Cohesion: 0.29
Nodes (9): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 6, ValidaÃ§Ãµes, Architecture & Data Flow, Design: Leads & Pipeline Domain, 3. Consultas e Mutacoes Server-Side, createLeadAction(), updateLeadAction() (+1 more)

### Community 73 - "customers/queries.ts"
Cohesion: 0.19
Nodes (15): AppointmentForm(), EditAppointmentPage(), EditAppointmentPageProps, NewAppointmentPage(), EditLeadPage(), EditLeadPageProps, LeadForm(), NewLeadPage() (+7 more)

### Community 74 - "Requirements"
Cohesion: 0.25
Nodes (7): Data Model, Multi-Tenancy & Authorization, Pipeline Stages, Purpose, Requirements, Spec: Leads & Pipeline Management, User Experience

### Community 75 - "Requirements"
Cohesion: 0.25
Nodes (7): Data Model, Multi-Tenancy & Authorization, Pipeline Stages, Purpose, Requirements, Spec: Leads & Pipeline Management, User Experience

### Community 76 - "eslint.config.mjs"
Cohesion: 0.20
Nodes (6): compat, __dirname, eslintConfig, __filename, nextConfig, @eslint/eslintrc

### Community 77 - "Requirements"
Cohesion: 0.29
Nodes (6): Data Model, Multi-Tenancy & Authorization, Purpose, Requirements, Spec: Customer Management, User Experience

### Community 78 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Schema Drizzle & Migrations, 2. Modulos de Dominio, Schemas Zod & Types, 3. Interface Web (App Router), 4. Testes Automatizados & Seguranca, 5. Documentacao & Validacoes, Tasks

### Community 79 - "Requirements"
Cohesion: 0.29
Nodes (6): Data Model, Multi-Tenancy & Authorization, Purpose, Requirements, Spec: Customer Management, User Experience

### Community 80 - "requireOrganizationForPage"
Cohesion: 0.19
Nodes (15): lucide-react, EditCustomerPage(), EditCustomerPageProps, CustomerDetailPage(), CustomerDetailPageProps, NewCustomerPage(), EditServicePage(), EditServicePageProps (+7 more)

### Community 81 - "ADR-002: Drizzle ORM com PostgreSQL"
Cohesion: 0.33
Nodes (6): ADR-002: Drizzle ORM com PostgreSQL, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 82 - "ADR-003: Better Auth para autenticaÃƒÂ§ÃƒÂ£o e sessao"
Cohesion: 0.33
Nodes (6): ADR-003: Better Auth para autenticaÃƒÂ§ÃƒÂ£o e sessao, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 83 - "ADR-004: shadcn/ui como biblioteca de componentes"
Cohesion: 0.33
Nodes (6): ADR-004: shadcn/ui como biblioteca de componentes, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 84 - "ADR-005: Nao utilizar o plugin Organizations do Better Auth"
Cohesion: 0.33
Nodes (6): ADR-005: Nao utilizar o plugin Organizations do Better Auth, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 85 - "ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side"
Cohesion: 0.33
Nodes (6): ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 86 - "ADR-007: AusÃƒÂªncia de exclusÃƒÂ£o fÃƒÂ­sica de Customers na Fase 5"
Cohesion: 0.33
Nodes (6): ADR-007: AusÃƒÂªncia de exclusÃƒÂ£o fÃƒÂ­sica de Customers na Fase 5, Alternativas, ConsequÃƒÂªncias, DecisÃƒÂ£o, Motivo, Problema

### Community 87 - "ADR-009: Gestão Operacional de Serviços, Profissionais e Agendamentos no MVP"
Cohesion: 0.33
Nodes (6): ADR-009: Gestão Operacional de Serviços, Profissionais e Agendamentos no MVP, Alternativas, Consequências, Decisão, Motivo, Problema

### Community 88 - "Proposal: Customer Management Domain"
Cohesion: 0.40
Nodes (4): Non-goals, Proposal: Customer Management Domain, What Changes, Why

### Community 89 - "Proposal: Leads & Commercial Pipeline Domain"
Cohesion: 0.40
Nodes (4): Non-goals, Proposal: Leads & Commercial Pipeline Domain, What Changes, Why

### Community 90 - "Spec: Services, Professionals & Appointments Operations"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Services, Professionals & Appointments Operations

### Community 91 - "revenue/new/page.tsx"
Cohesion: 0.23
Nodes (12): AppointmentDetailPage(), AppointmentDetailPageProps, AppointmentsPage(), AppointmentsPageProps, AppointmentStatusBadge(), AppointmentStatusSelect(), formatCurrency(), NewRevenuePage() (+4 more)

### Community 92 - "Spec: Services, Professionals & Appointments Operations"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Services, Professionals & Appointments Operations

### Community 98 - "cn"
Cohesion: 0.13
Nodes (24): @radix-ui/react-dropdown-menu, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuShortcut(), DropdownMenuSubContent, DropdownMenuSubTrigger (+16 more)

### Community 99 - "toast.tsx"
Cohesion: 0.26
Nodes (10): metadata, RootLayout(), Toast, ToastAction, ToastClose, ToastDescription, ToastTitle, toastVariants (+2 more)

### Community 101 - "follow-ups/page.tsx"
Cohesion: 0.30
Nodes (8): FollowUpActionButtons(), FollowUpDetailPage(), FollowUpDetailPageProps, FollowUpsPage(), FollowUpsPageProps, FollowUpStatusBadge(), getFollowUpCounts(), getFollowUps()

### Community 103 - "ADR-010: Gestão Manual de Follow-ups e Registro de Desfecho no MVP"
Cohesion: 0.33
Nodes (6): ADR-010: Gestão Manual de Follow-ups e Registro de Desfecho no MVP, Alternativas, Consequencias, Decisao, Motivo, Problema

### Community 105 - "Design"
Cohesion: 0.22
Nodes (8): Context, Decisions, Design, Goals / Non-Goals, Helpers de Autorizacao Server-Side, Resolucao de Tenant Ativo via Cookie Seguro + Validacao no Banco, Risks / Trade-offs, Schema de Tenancy no Dominio RevenueFlow (ADR-006)

### Community 107 - "Spec: Follow-ups Management"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Follow-ups Management

### Community 108 - "Spec: Follow-ups Management"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Follow-ups Management

### Community 110 - "diagnose.js"
Cohesion: 0.29
Nodes (6): deps, fs, globals, layout, pkg, tailwind

### Community 116 - "dialog.tsx"
Cohesion: 0.29
Nodes (7): @radix-ui/react-dialog, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle

### Community 129 - "conversion-isolation.test.ts"
Cohesion: 0.18
Nodes (7): zod, CreateConversionInput, createConversionSchema, CONVERSION_ATTRIBUTION_TYPES, ConversionsDomainEngine, MockMembership, MockUser

### Community 131 - "conversions/[id]/page.tsx"
Cohesion: 0.06
Nodes (57): Notas da execução (2026-09-25), AttributionBadge(), ConversionDetailPage(), ConversionDetailPageProps, formatCurrency(), formatDate(), ConversionsPage(), formatCurrency() (+49 more)

### Community 136 - "Design"
Cohesion: 0.29
Nodes (6): AppShell como Server Component Wrapper, Context, Decisions, Design, Responsividade via shadcn/ui `Sheet`, Risks / Trade-offs

### Community 138 - "Proposal"
Cohesion: 0.33
Nodes (5): Capabilities, Impact, New Capabilities, Proposal, Why

### Community 139 - "Melhorias da interface e pendências de alinhamento"
Cohesion: 0.33
Nodes (5): Divergências da especificação, Escopo preservado, Graphify no Windows, Melhorias da interface e pendências de alinhamento, Verificação realizada

### Community 140 - "Tasks"
Cohesion: 0.40
Nodes (4): 1. Setup, 3. Integração de Layout, 4. Validação, Tasks

### Community 141 - "Proposal: Follow-ups Domain & Activity Management"
Cohesion: 0.40
Nodes (4): Non-goals, Proposal: Follow-ups Domain & Activity Management, What Changes, Why

## Knowledge Gaps
- **10 isolated node(s):** `react-dom`, `@types/node`, `@types/react`, `@types/react-dom`, `autoprefixer` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 706 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireSession()` connect `requireSession` to `customers.ts`, `Customer`, `conversions/[id]/page.tsx`, `next`, `follow-ups/page.tsx`, `updateLeadStageAction`, `Design`, `customers/queries.ts`, `revenue/new/page.tsx`, `leads/actions.ts`, `requireOrganizationForPage`, `tenancy/actions.ts`, `ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side`, `Button`, `follow-ups/actions.ts`, `operations-isolation.test.ts`, `header.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `requireSession()` (e.g. with `O que foi implementado na Fase 5` and `Decisao`) actually correct?**
  _`requireSession()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **What connects `react-dom`, `@types/node`, `@types/react` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.md` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `conversions/[id]/page.tsx`, `package.json`, `tenancy/actions.ts`, `requireSession`, `operations-isolation.test.ts`, `header.tsx`, `customers.ts`, `leads/actions.ts`, `middleware.ts`, `Button`, `follow-ups/actions.ts`, `lead-form.tsx`, `Customer`, `customers/queries.ts`, `eslint.config.mjs`, `requireOrganizationForPage`, `revenue/new/page.tsx`, `toast.tsx`, `follow-ups/page.tsx`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `spec.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `Decisoes Arquiteturais Ã¢â‚¬â€ RevenueFlow` connect `Decisoes Arquiteturais Ã¢â‚¬â€ RevenueFlow` to `customers.ts`, `ADR-008: Modelo Unificado de Leads e Pipeline no MVP`, `ADR-010: Gestão Manual de Follow-ups e Registro de Desfecho no MVP`, `ADR-001: Monolito modular com Next.js`, `ADR-002: Drizzle ORM com PostgreSQL`, `ADR-003: Better Auth para autenticaÃƒÂ§ÃƒÂ£o e sessao`, `ADR-004: shadcn/ui como biblioteca de componentes`, `ADR-005: Nao utilizar o plugin Organizations do Better Auth`, `ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side`, `ADR-007: AusÃƒÂªncia de exclusÃƒÂ£o fÃƒÂ­sica de Customers na Fase 5`, `ADR-009: Gestão Operacional de Serviços, Profissionais e Agendamentos no MVP`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._