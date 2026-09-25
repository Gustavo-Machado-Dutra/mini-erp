# Graph Report - mini-erp  (2026-09-17)

## Corpus Check
- 168 files · ~72,325 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 1140 nodes · 1671 edges · 98 communities (81 shown, 17 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 58 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

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
- app/layout.tsx
- dependencies
- ref_lib_db
- devDependencies
- Design
- ADDED Requirements
- Requirements
- tenancy.ts
- route.ts
- ref_components_ui_button
- ADDED Requirements
- Requirements
- ADDED Requirements
- Tasks
- Requirements
- Decisions
- lead-isolation.test.ts
- Proposal
- 4. Stack Oficial do MVP
- operations-isolation.test.ts
- scripts
- button.tsx
- middleware.ts
- 6. Multi-Tenancy
- 11. Dashboard
- 7. Perfis e Autorização
- utils.ts
- 1. Visão do Produto
- 5. Arquitetura
- auth-client.ts
- (protected)/layout.tsx
- tailwindcss
- follow-ups/actions.ts
- ref_next_link
- appointment-form.tsx
- Tasks
- leads/page.tsx
- drizzle-orm
- ref_modules_tenancy_context
- services/actions.ts
- lead-form.tsx
- appointments/[id]/page.tsx
- appointments/actions.ts
- professional-form.tsx
- service-form.tsx
- appointments/queries.ts
- Requirements
- Requirements
- eslint.config.mjs
- Requirements
- Tasks
- Requirements
- react
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
- Spec: Follow-ups Management
- Spec: Services, Professionals & Appointments Operations
- follow-ups/loading.tsx
- Decisoes Arquiteturais Ã¢â‚¬â€ RevenueFlow

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 24 edges
2. `drizzle-orm` - 22 edges
3. `react` - 17 edges
4. `compilerOptions` - 16 edges
5. `Customer` - 15 edges
6. `requireSession()` - 15 edges
7. `OperationsDomainEngine` - 13 edges
8. `8. Domínio` - 13 edges
9. `20. Roadmap do MVP` - 13 edges
10. `14. Banco de Dados` - 12 edges

## Surprising Connections (you probably didn't know these)
- `What Changes` --references--> `Organization`  [INFERRED]
  openspec/changes/archive/2026-09-17-services-professionals-appointments/proposal.md → src/db/schema/tenancy.ts
- `Decisao` --references--> `requireSession()`  [INFERRED]
  docs/DECISIONS.md → src/modules/tenancy/context.ts
- `What Changes` --references--> `Sidebar()`  [INFERRED]
  openspec/changes/follow-ups/proposal.md → src/components/layout/sidebar.tsx
- `2. Modulo de Dominio, Zod & Tipos` --references--> `createFollowUpAction()`  [INFERRED]
  openspec/changes/follow-ups/tasks.md → src/modules/follow-ups/actions.ts
- `2. Modulo de Dominio, Zod & Tipos` --references--> `updateFollowUpAction()`  [INFERRED]
  openspec/changes/follow-ups/tasks.md → src/modules/follow-ups/actions.ts

## Import Cycles
- None detected.

## Communities (98 total, 17 thin omitted)

### Community 0 - "context.md"
Cohesion: 0.05
Nodes (38): 0. Estado Atual do Desenvolvimento, 0. Estado Atual do Desenvolvimento, 0. Estado Atual do Desenvolvimento, 10. Follow-ups, 11. Revenue Attribution, 12. Dashboard, 13. Desenvolvimento, 14. TLC Spec-Driven Development (+30 more)

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
Nodes (46): Context, Decisions, Design, Goals / Non-Goals, Helpers de Autorizacao Server-Side, Resolucao de Tenant Ativo via Cookie Seguro + Validacao no Banco, Risks / Trade-offs, Schema de Tenancy no Dominio RevenueFlow (ADR-006) (+38 more)

### Community 19 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 26 - "app/layout.tsx"
Cohesion: 0.25
Nodes (5): nextConfig, next, ref_path, src_app_globals, metadata

### Community 27 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, better-auth, class-variance-authority, clsx, drizzle-orm, lucide-react, next, postgres (+10 more)

### Community 28 - "ref_lib_db"
Cohesion: 0.16
Nodes (13): better-auth, ref_better_auth_adapters_drizzle, ref_db_schema, ref_drizzle_orm_postgres_js, ref_lib_db, ref_next_headers, postgres, server-only (+5 more)

### Community 29 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, autoprefixer, drizzle-kit, eslint, eslint-config-next, @eslint/eslintrc, postcss, tailwindcss (+5 more)

### Community 30 - "Design"
Cohesion: 0.08
Nodes (26): AppShell como Server Component Wrapper, Context, Decisions, Design, Goals / Non-Goals, Responsividade via shadcn/ui `Sheet`, Risks / Trade-offs, Capabilities (+18 more)

### Community 31 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Purpose, Requirement: Cadastro com email e senha, Requirement: Login com email e senha, Requirement: Logout, Requirement: Protecao de rotas, Requirement: Sessao segura, Scenario: Acesso autenticado a rota protegida (+10 more)

### Community 32 - "Requirements"
Cohesion: 0.11
Nodes (18): auth/email-password Specification, Purpose, Requirement: Cadastro com email e senha, Requirement: Login com email e senha, Requirement: Logout, Requirement: Protecao de rotas, Requirement: Sessao segura, Requirements (+10 more)

### Community 33 - "tenancy.ts"
Cohesion: 0.09
Nodes (37): ref_drizzle_orm_pg_core, appointments, AppointmentStatus, appointmentStatusEnum, NewAppointment, account, session, user (+29 more)

### Community 34 - "route.ts"
Cohesion: 0.33
Nodes (5): ref_better_auth_next_js, ref_lib_auth, dynamic, GET, POST

### Community 35 - "ref_components_ui_button"
Cohesion: 0.10
Nodes (15): ref_components_ui_button, ref_components_ui_label, ref_lib_auth_client, ref_modules_follow_ups_actions, ref_modules_tenancy_actions, ref_modules_tenancy_types, ref_next_navigation, zod (+7 more)

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

### Community 43 - "lead-isolation.test.ts"
Cohesion: 0.06
Nodes (45): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 6, ValidaÃ§Ãµes, ADR-008: Modelo Unificado de Leads e Pipeline no MVP, Alternativas, ConsequÃªncias, DecisÃ£o, Motivo (+37 more)

### Community 44 - "Proposal"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Proposal, What Changes, Why

### Community 45 - "4. Stack Oficial do MVP"
Cohesion: 0.25
Nodes (8): 4.1 Framework, 4.2 UI, 4.3 Backend/Data, 4.4 Validação, 4.5 Testes, 4.6 Qualidade, 4.7 Não utilizar inicialmente, 4. Stack Oficial do MVP

### Community 46 - "operations-isolation.test.ts"
Cohesion: 0.09
Nodes (25): Architecture & Data Flow, Design: Services, Professionals & Appointments, Non-goals, Proposal: Services, Professionals & Appointments Operations, What Changes, Why, ref_node_assert_strict, ref_node_test (+17 more)

### Community 47 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, start, test, typecheck

### Community 48 - "button.tsx"
Cohesion: 0.40
Nodes (5): class-variance-authority, @radix-ui/react-slot, Button, ButtonProps, buttonVariants

### Community 49 - "middleware.ts"
Cohesion: 0.33
Nodes (4): ref_next_server, config, guestOnlyRoutes, protectedRoutes

### Community 50 - "6. Multi-Tenancy"
Cohesion: 0.33
Nodes (6): 6.1 Modelo, 6.2 Membership, 6.3 Organização atual, 6.4 Isolamento no banco, 6.5 Secrets e acesso ao banco, 6. Multi-Tenancy

### Community 51 - "11. Dashboard"
Cohesion: 0.40
Nodes (5): 11.1 Gráfico, 11.2 Pipeline, 11.3 Follow-ups, 11.4 Atividades recentes, 11. Dashboard

### Community 52 - "7. Perfis e Autorização"
Cohesion: 0.40
Nodes (5): 7.1 Platform Admin, 7.2 Organization Owner, 7.3 Organization Admin, 7.4 Professional, 7. Perfis e Autorização

### Community 54 - "1. Visão do Produto"
Cohesion: 0.50
Nodes (4): 1.1 Nome, 1.2 Proposta, 1.3 Nicho inicial, 1. Visão do Produto

### Community 55 - "5. Arquitetura"
Cohesion: 0.50
Nodes (4): 5.1 Server Components, 5.2 Client Components, 5.3 Server Actions, 5. Arquitetura

### Community 59 - "follow-ups/actions.ts"
Cohesion: 0.06
Nodes (35): Architecture & Data Flow, Design: Follow-ups Domain, 1. Schema Drizzle & Migrations, 2. Modulo de Dominio, Zod & Tipos, 3. Interface Web (App Router), 4. Testes Automatizados & Seguranca, 5. Documentacao & Validacoes, Tasks (+27 more)

### Community 61 - "ref_next_link"
Cohesion: 0.13
Nodes (11): ref_components_ui_input, lucide-react, ref_modules_customers_actions, ref_next_link, CustomerFormData, CustomerFormProps, EditCustomerPageProps, CustomersPageProps (+3 more)

### Community 62 - "appointment-form.tsx"
Cohesion: 0.11
Nodes (12): ref_modules_appointments_actions, ref_modules_professionals_queries, ref_modules_services_queries, AppointmentForm(), AppointmentFormData, AppointmentFormProps, CustomerOption, ProfessionalOption (+4 more)

### Community 63 - "Tasks"
Cohesion: 0.12
Nodes (16): 0. Estado Atual do Desenvolvimento, O que foi implementado na Fase 5, ValidaÃƒÂ§ÃƒÂµes, Architecture & Data Flow, Design: Customer Management Domain, 1. Schema Drizzle & Migrations, 2. Dominio, Validacao Zod & Tipos, 3. Consultas e Mutacoes Server-Side (+8 more)

### Community 64 - "leads/page.tsx"
Cohesion: 0.18
Nodes (11): ref_db_schema_leads, ref_modules_leads_actions, ref_modules_leads_types, LeadDetailPageProps, LeadsPageProps, PipelineView(), PipelineViewProps, StageBadge() (+3 more)

### Community 65 - "drizzle-orm"
Cohesion: 0.18
Nodes (9): ref_db_schema_professionals, drizzle-orm, CreateProfessionalInput, createProfessionalSchema, UpdateProfessionalInput, updateProfessionalSchema, ActionResult, src_modules_professionals_types_professional (+1 more)

### Community 66 - "ref_modules_tenancy_context"
Cohesion: 0.19
Nodes (12): ref_db_schema_customers, ref_modules_tenancy_context, ref_next_cache, CreateCustomerData, CreateCustomerInput, createCustomerSchema, UpdateCustomerData, UpdateCustomerInput (+4 more)

### Community 67 - "services/actions.ts"
Cohesion: 0.18
Nodes (8): ref_db_schema_services, CreateServiceInput, createServiceSchema, UpdateServiceInput, updateServiceSchema, ActionResult, src_modules_services_types_service, ServiceFilterOptions

### Community 68 - "lead-form.tsx"
Cohesion: 0.15
Nodes (9): ref_modules_customers_queries, ref_modules_leads_queries, CustomerDetailPageProps, EditLeadPageProps, COMMON_SOURCES, CustomerOption, LeadForm(), LeadFormData (+1 more)

### Community 69 - "appointments/[id]/page.tsx"
Cohesion: 0.21
Nodes (9): ref_db_schema_appointments, ref_modules_appointments_queries, ref_modules_appointments_types, AppointmentDetailPageProps, AppointmentsPageProps, AppointmentStatusBadge(), StatusBadgeProps, AppointmentStatusSelect() (+1 more)

### Community 70 - "appointments/actions.ts"
Cohesion: 0.26
Nodes (7): CreateAppointmentInput, createAppointmentSchema, UpdateAppointmentInput, updateAppointmentSchema, UpdateAppointmentStatusInput, updateAppointmentStatusSchema, src_modules_appointments_types_appointment

### Community 71 - "professional-form.tsx"
Cohesion: 0.24
Nodes (5): ref_modules_professionals_actions, EditProfessionalPageProps, ProfessionalForm(), ProfessionalFormData, ProfessionalFormProps

### Community 72 - "service-form.tsx"
Cohesion: 0.24
Nodes (5): ref_modules_services_actions, EditServicePageProps, ServiceForm(), ServiceFormData, ServiceFormProps

### Community 73 - "appointments/queries.ts"
Cohesion: 0.24
Nodes (6): ActionResult, APPOINTMENT_STATUS_COLORS, APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUSES, AppointmentFilterOptions, AppointmentWithDetails

### Community 74 - "Requirements"
Cohesion: 0.25
Nodes (7): Data Model, Multi-Tenancy & Authorization, Pipeline Stages, Purpose, Requirements, Spec: Leads & Pipeline Management, User Experience

### Community 75 - "Requirements"
Cohesion: 0.25
Nodes (7): Data Model, Multi-Tenancy & Authorization, Pipeline Stages, Purpose, Requirements, Spec: Leads & Pipeline Management, User Experience

### Community 76 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): compat, __dirname, eslintConfig, __filename, @eslint/eslintrc, ref_url

### Community 77 - "Requirements"
Cohesion: 0.29
Nodes (6): Data Model, Multi-Tenancy & Authorization, Purpose, Requirements, Spec: Customer Management, User Experience

### Community 78 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Schema Drizzle & Migrations, 2. Modulos de Dominio, Schemas Zod & Types, 3. Interface Web (App Router), 4. Testes Automatizados & Seguranca, 5. Documentacao & Validacoes, Tasks

### Community 79 - "Requirements"
Cohesion: 0.29
Nodes (6): Data Model, Multi-Tenancy & Authorization, Purpose, Requirements, Spec: Customer Management, User Experience

### Community 80 - "react"
Cohesion: 0.33
Nodes (5): ref_lib_utils, react, Input, InputProps, Label

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

### Community 91 - "Spec: Follow-ups Management"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Follow-ups Management

### Community 92 - "Spec: Services, Professionals & Appointments Operations"
Cohesion: 0.50
Nodes (3): Purpose, Requirements, Spec: Services, Professionals & Appointments Operations

## Knowledge Gaps
- **555 isolated node(s):** `__filename`, `__dirname`, `compat`, `eslintConfig`, `nextConfig` (+550 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 679 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drizzle-orm` connect `drizzle-orm` to `tenancy.ts`, `ref_modules_tenancy_context`, `services/actions.ts`, `appointments/actions.ts`, `appointments/queries.ts`, `lead-isolation.test.ts`, `package.json`, `tenancy/actions.ts`, `follow-ups/actions.ts`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `requireSession()` connect `tenancy/actions.ts` to `lead-isolation.test.ts`, `operations-isolation.test.ts`, `ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side`, `follow-ups/actions.ts`, `Tasks`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `O que foi implementado na Fase 5` connect `Tasks` to `tenancy/actions.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _555 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `spec.md` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._