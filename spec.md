# RevenueFlow — SPEC

> **Status:** Draft inicial — Fundação do MVP
>
> **Objetivo deste documento:** fonte de verdade funcional e arquitetural do RevenueFlow.
>
> **Escopo:** MVP para desenvolvimento e validação. O sistema não será colocado em produção nesta etapa.
>
> **Regra de precedência:** este arquivo define o que o produto deve ser. `context.md` registra memória operacional resumida. OpenSpec documenta mudanças de desenvolvimento; TLC Spec-Driven Development planeja e organiza a execução dessas mudanças.

---

# 1. Visão do Produto

## 1.1 Nome

**RevenueFlow**

Nome provisório do produto.

## 1.2 Proposta

RevenueFlow é um SaaS B2B para ajudar empresas de serviços a recuperar oportunidades comerciais, clientes e agendamentos perdidos por meio de follow-ups, acompanhamento do funil e inteligência operacional.

O produto deve ser orientado a **resultado financeiro**, e não simplesmente a comunicação.

O sistema deverá permitir responder perguntas como:

- Quantos leads chegaram?
- Quantos responderam?
- Quantos avançaram no pipeline?
- Quantos agendamentos foram realizados?
- Quantos follow-ups estão pendentes?
- Quantas oportunidades converteram?
- Qual receita foi registrada?
- Quanto dessa receita pode ser atribuída ou influenciada pelo RevenueFlow?
- Quais oportunidades estão sendo perdidas?

## 1.3 Nicho inicial

O primeiro nicho é **clínicas de estética**.

A modelagem, nomenclatura e regras de domínio devem permanecer genéricas para permitir evolução para:

- dentistas;
- barbearias;
- salões;
- pet shops;
- oficinas;
- academias;
- imobiliárias;
- clínicas;
- outros negócios de serviços.

Evitar entidades ou campos que tornem o sistema dependente de um único nicho.

---

# 2. Objetivo do MVP

O MVP deve validar o núcleo do produto:

1. autenticação;
2. organizações;
3. memberships;
4. isolamento multi-tenant;
5. clientes;
6. profissionais;
7. serviços;
8. leads;
9. oportunidades/pipeline;
10. agendamentos;
11. follow-ups manuais;
12. conversões;
13. eventos de receita;
14. atribuição básica de receita;
15. dashboard comercial.

Os dados poderão ser inseridos manualmente.

O MVP não precisa executar automações reais nem integrar canais externos.

---

# 3. Princípios do Projeto

## 3.1 Simplicidade

O projeto é um MVP.

Não adicionar tecnologias, serviços ou abstrações sem necessidade concreta.

## 3.2 Segurança

O isolamento entre organizações é requisito estrutural.

A aplicação nunca deve depender exclusivamente de filtros no frontend ou em consultas como:

```ts
.eq("organization_id", organizationId)
```

O PostgreSQL/RLS deve impor o isolamento.

## 3.3 Evolução sem overengineering

A arquitetura deve permitir evolução futura, mas sem implementar infraestrutura futura prematuramente.

## 3.4 Banco como fonte de verdade

Dados de negócio persistentes pertencem ao PostgreSQL.

## 3.5 Server-side first

Regras de negócio, autorização e mutações importantes devem ocorrer no servidor.

## 3.6 Não confiar no cliente

Nunca confiar em:

- `organization_id` enviado pelo browser;
- role enviada pelo browser;
- IDs sem autorização;
- valores financeiros calculados apenas no cliente;
- dados de formulário sem validação.

## 3.7 Mudanças pequenas

Implementações devem ser incrementais, revisáveis e testáveis.

---

# 4. Stack Oficial do MVP

## 4.1 Framework

- Next.js
- App Router
- React
- TypeScript strict

## 4.2 UI

- Tailwind CSS
- shadcn/ui
- Lucide Icons, quando necessário

## 4.3 Backend/Data

- PostgreSQL
- Better Auth
- Drizzle ORM

O backend deve ser implementado dentro do Next.js. Não utilizar PostgreSQL/Better Auth como backend ou camada de autenticação.

## 4.4 Validação

- Zod
- React Hook Form

## 4.5 Testes

- Playwright para E2E
- testes unitários somente quando houver regras de domínio relevantes

## 4.6 Qualidade

- ESLint
- TypeScript typecheck

## 4.7 Não utilizar inicialmente

Não adicionar:

- NestJS;
- Fastify;
- Prisma;
- Drizzle;
- Redis;
- Kafka;
- Kubernetes;
- microservices;
- GraphQL;
- TanStack Query globalmente;
- IA/LLM;
- WhatsApp;
- Instagram/Meta;
- Stripe/Mercado Pago;
- agentes de voz;
- automation engine;
- filas;
- workers;
- vector database;
- observabilidade avançada;
- infraestrutura distribuída.

Uma tecnologia só poderá ser adicionada quando uma necessidade concreta do MVP justificar sua introdução.

---

# 5. Arquitetura

A arquitetura inicial é um **monólito modular simples**.

```text
Browser
   |
   v
Next.js
   |
   +-- Server Components
   +-- Client Components quando necessário
   +-- Server Actions
   +-- Route Handlers quando necessários
   |
   v
PostgreSQL/Better Auth
   |
   +-- Auth
   +-- PostgreSQL
   +-- RLS
```

Não criar backend separado.

## 5.1 Server Components

Usar Server Components para páginas predominantemente de leitura quando isso simplificar a implementação.

## 5.2 Client Components

Usar Client Components apenas quando houver necessidade de:

- interação rica;
- estado local;
- eventos de browser;
- componentes interativos;
- formulários que necessitem de comportamento client-side.

## 5.3 Server Actions

Usar Server Actions para mutações internas da aplicação quando apropriado.

Server Actions são parte do backend e devem:

1. verificar sessão;
2. determinar o usuário autenticado;
3. determinar a organização autorizada;
4. validar os dados com Zod;
5. verificar permissões;
6. executar a regra de negócio;
7. persistir através do Drizzle;
8. retornar resultado ou erro consistente.

Não confiar em valores enviados pelo browser para autorização.

Exemplos:

- criar cliente;
- atualizar cliente;
- criar lead;
- mover oportunidade;
- criar agendamento;
- criar follow-up;
- registrar conversão.

Toda Server Action deve:

1. autenticar;
2. identificar o usuário;
3. determinar a organização permitida;
4. validar input;
5. autorizar operação;
6. executar mutação;
7. retornar resultado ou erro consistente.

---

# 6. Multi-Tenancy

RevenueFlow é multi-tenant.

Cada organização representa um tenant independente.

Exemplo:

```text
Organization A
  Clínica Bella

Organization B
  Clínica Prime
```

Usuários da Organization A nunca podem consultar dados da Organization B.

## 6.1 Modelo

```text
auth.users
    |
    v
profiles
    |
    v
organization_members
    |
    v
organizations
```

Dados empresariais possuem vínculo com `organization_id` quando aplicável.

## 6.2 Membership

Um usuário pode futuramente pertencer a mais de uma organização.

`organization_members` deve representar a relação.

Campos conceituais:

- id;
- organization_id;
- user_id;
- role;
- created_at.

Criar constraint única:

```text
unique(organization_id, user_id)
```

## 6.3 Organização atual

A interface poderá possuir um organization selector no futuro.

O cliente não deve ter autoridade para escolher arbitrariamente uma organização.

O servidor deve verificar membership.

## 6.4 Isolamento no banco

Como o MVP não utiliza PostgreSQL/Better Auth, RLS não é uma dependência obrigatória da aplicação.

A proteção primária será:

- sessão Better Auth;
- membership;
- autorização server-side;
- queries sempre limitadas ao tenant autorizado;
- foreign keys;
- constraints;
- testes automatizados de isolamento.

A camada de banco pode utilizar PostgreSQL RLS posteriormente se houver benefício concreto, mas isso não deve bloquear o MVP.

O princípio obrigatório é:

```text
Better Auth session
    |
    v
organization_members
    |
    v
organization_id autorizado
    |
    v
server-side query
    |
    v
PostgreSQL
```

Nunca confiar apenas em um `organization_id` fornecido pelo cliente.

## 6.5 Secrets e acesso ao banco

Não utilizar PostgreSQL/Better Auth Service Role Key.

Credenciais do PostgreSQL e secrets do Better Auth devem existir somente no ambiente server.

Nunca:

- expor DATABASE_URL ao cliente;
- expor BETTER_AUTH_SECRET ao cliente;
- colocar secrets em Client Components;
- commitar secrets;
- retornar secrets em respostas de API.

O acesso ao PostgreSQL deve ocorrer exclusivamente no backend.

---

# 7. Perfis e Autorização

## 7.1 Platform Admin

Usuário interno da plataforma RevenueFlow.

Não é administrador de uma organização cliente.

Não precisa ser implementado completamente no primeiro fluxo do MVP, mas o modelo deve permitir sua existência.

## 7.2 Organization Owner

Dono da organização.

Permissões iniciais:

- visualizar organização;
- gerenciar membros;
- gerenciar clientes;
- gerenciar profissionais;
- gerenciar serviços;
- gerenciar leads;
- gerenciar oportunidades;
- gerenciar agendamentos;
- gerenciar follow-ups;
- registrar conversões;
- visualizar métricas.

## 7.3 Organization Admin

Administrador interno.

Permissões semelhantes ao owner, exceto ações críticas que futuramente possam exigir owner.

## 7.4 Professional

Funcionário/profissional.

Inicialmente poderá:

- visualizar sua agenda;
- visualizar dados permitidos;
- consultar clientes permitidos;
- executar follow-ups permitidos.

A arquitetura deve permitir granularidade futura, mas não implementar RBAC complexo agora.

---

# 8. Domínio

## 8.1 Organizations

Representam empresas clientes.

Campos mínimos:

- id UUID;
- name;
- created_at;
- updated_at.

## 8.2 Profiles

Representam informações básicas do usuário autenticado.

Não duplicar credenciais do PostgreSQL/Better Auth Auth.

Campos possíveis:

- id UUID, relacionado ao `auth.users.id`;
- full_name;
- created_at;
- updated_at.

## 8.3 Organization Members

Relacionam usuários às organizações.

Campos:

- id;
- organization_id;
- user_id;
- role;
- created_at;
- updated_at.

Roles iniciais:

- owner;
- admin;
- professional.

## 8.4 Customers

Representam clientes do negócio.

Campos conceituais:

- id;
- organization_id;
- name;
- email;
- phone;
- notes;
- created_at;
- updated_at;
- created_by.

Um cliente pode possuir histórico de:

- leads;
- oportunidades;
- agendamentos;
- follow-ups;
- conversões;
- eventos de receita.

## 8.5 Professionals

Representam profissionais/funcionários que podem executar serviços ou possuir agenda.

`user_id` pode ser nullable para permitir profissionais sem login.

Campos:

- id;
- organization_id;
- user_id nullable;
- name;
- email;
- phone;
- active;
- created_at;
- updated_at;
- created_by.

## 8.6 Services

Representam serviços comercializados pela organização.

Campos:

- id;
- organization_id;
- name;
- description;
- price;
- duration_minutes;
- active;
- created_at;
- updated_at;
- created_by.

Valores monetários devem utilizar `numeric/decimal`, nunca floating point.

## 8.7 Appointments

Representam agendamentos.

Campos conceituais:

- id;
- organization_id;
- customer_id;
- professional_id;
- service_id;
- scheduled_at;
- status;
- notes;
- created_at;
- updated_at;
- created_by.

Status iniciais possíveis:

- scheduled;
- confirmed;
- completed;
- cancelled;
- no_show.

Não criar lógica avançada de calendário no MVP.

## 8.8 Leads

Representam oportunidades de entrada comercial.

Um lead pode estar associado a um customer existente ou representar um contato ainda não convertido.

Campos conceituais:

- id;
- organization_id;
- customer_id nullable;
- name;
- email;
- phone;
- source;
- status;
- created_at;
- updated_at;
- created_by.

Status iniciais:

- new;
- contacted;
- qualified;
- converted;
- lost.

## 8.9 Opportunities

Representam oportunidades comerciais acompanhadas no pipeline.

Campos:

- id;
- organization_id;
- lead_id nullable;
- customer_id nullable;
- title;
- value;
- stage;
- lost_reason nullable;
- created_at;
- updated_at;
- created_by.

Pipeline inicial:

```text
new
contacted
interested
scheduled
won
lost
```

O pipeline deve ser orientado por dados, não por tabelas separadas para cada estágio.

## 8.10 Follow-ups

Entidade fundamental do MVP.

Inicialmente serão manuais.

Campos:

- id;
- organization_id;
- customer_id nullable;
- lead_id nullable;
- opportunity_id nullable;
- type;
- status;
- scheduled_at;
- executed_at nullable;
- channel;
- outcome nullable;
- notes nullable;
- automation_id nullable somente se houver necessidade futura e a coluna for justificada;
- created_at;
- updated_at;
- created_by.

Tipos iniciais:

- manual.

Canais iniciais:

- phone;
- email;
- other.

Não implementar WhatsApp agora.

Status:

- pending;
- completed;
- cancelled;
- overdue, se preferível como estado derivado em vez de persistido.

Preferir calcular `overdue` quando possível, evitando duplicação de estado.

## 8.11 Conversions

Representam uma conversão comercial.

Uma conversão significa que uma oportunidade resultou em negócio/conversão registrada.

Campos:

- id;
- organization_id;
- customer_id;
- opportunity_id nullable;
- appointment_id nullable;
- amount;
- converted_at;
- attribution_type;
- notes;
- created_at;
- created_by.

Tipos iniciais:

- direct_conversion;
- follow_up_conversion;
- reactivation_conversion;
- manual_conversion;
- unknown.

## 8.12 Revenue Events

Representam eventos financeiros registrados.

Não confundir com cobrança do SaaS.

O evento representa receita do negócio cliente.

Campos conceituais:

- id;
- organization_id;
- customer_id nullable;
- opportunity_id nullable;
- conversion_id nullable;
- amount;
- currency;
- source;
- status;
- occurred_at;
- created_at;
- created_by.

Valores devem utilizar decimal/numeric.

---

# 9. Entidades adiadas

Não criar no MVP sem requisito concreto:

- conversations;
- messages;
- automations;
- automation_runs;
- integrations;
- audit_logs;
- subscriptions;
- billing;
- invoices;
- payments;
- campaigns;
- AI agents.

Essas entidades poderão ser adicionadas por mudanças futuras documentadas.

---

# 10. Receita e Attribution

Receita registrada e receita atribuída não são conceitos idênticos.

## 10.1 Receita registrada

Representa dinheiro que foi registrado como receita do negócio.

```text
revenue_event
amount = 500
```

## 10.2 Attribution

O sistema deve evitar declarar que todo dinheiro registrado foi recuperado pelo RevenueFlow.

Inicialmente usar tipos:

- `direct_conversion`;
- `follow_up_conversion`;
- `reactivation_conversion`;
- `manual_conversion`;
- `unknown`.

## 10.3 Regra inicial

Uma receita só deve aparecer como **receita recuperada** quando houver evidência de que uma ação do RevenueFlow participou da conversão.

No MVP, essa evidência poderá ser registrada manualmente.

Exemplo:

```text
Lead
  |
  v
Follow-up
  |
  v
Opportunity
  |
  v
Conversion
  |
  v
Revenue Event
```

## 10.4 Métricas

Dashboard poderá separar:

- receita registrada;
- receita atribuída diretamente;
- receita recuperada/influenciada;
- receita sem attribution.

Não criar modelo estatístico de attribution no MVP.

---

# 11. Dashboard

Dashboard é orientado a dinheiro e conversão.

Métricas principais:

- leads no período;
- conversões;
- taxa de conversão;
- follow-ups pendentes;
- receita registrada;
- receita recuperada.

Exemplo:

```text
Leads
120

Conversões
34

Taxa de conversão
28,3%

Follow-ups pendentes
18

Receita registrada
R$ 22.400

Receita recuperada
R$ 5.200
```

## 11.1 Gráfico

Inicialmente:

```text
Receita total
vs
Receita recuperada
```

por período.

## 11.2 Pipeline

Mostrar:

```text
Novo lead
Contato realizado
Interessado
Agendado
Convertido
Perdido
```

## 11.3 Follow-ups

Mostrar:

- hoje;
- atrasados;
- próximos.

## 11.4 Atividades recentes

Mostrar eventos relevantes e recentes.

Evitar dashboard excessivamente carregado.

---

# 12. Interface

Layout:

```text
Sidebar
├── Dashboard
├── Leads
├── Clientes
├── Pipeline
├── Agenda
├── Follow-ups
├── Automações
├── Relatórios
├── Integrações
├── Equipe
└── Configurações
```

No MVP, itens ainda não implementados devem:

- permanecer ocultos; ou
- aparecer como `Em breve` somente se isso ajudar a navegação.

Não criar páginas falsas sem funcionalidade.

Header:

- organization selector quando aplicável;
- busca somente quando implementada;
- notificações somente quando houver funcionalidade;
- perfil.

## 12.1 UX

Utilizar:

- loading states;
- skeletons quando necessário;
- empty states;
- mensagens de erro;
- confirmação para ações destrutivas;
- feedback de sucesso;
- tabelas responsivas;
- formulários claros;
- acessibilidade básica.

---

# 13. Validação

Zod é a biblioteca oficial de validação do backend.

Toda entrada que atravesse uma fronteira de confiança deve ser validada no servidor:

- Server Actions;
- Route Handlers;
- parâmetros;
- query strings;
- payloads JSON;
- dados de formulários.

Fluxo:

```text
Request
 ↓
Better Auth
 ↓
Zod
 ↓
Authorization
 ↓
Business logic
 ↓
Drizzle
 ↓
PostgreSQL
```

Zod não substitui constraints do PostgreSQL.

Fluxo:

```text
UI
 ↓
Zod
 ↓
Server Action
 ↓
Auth
 ↓
Authorization
 ↓
Database/RLS
```

Zod não substitui constraints do PostgreSQL.

---

# 14. Banco de Dados

## 14.1 PostgreSQL

PostgreSQL é o banco oficial do MVP.

## 14.2 Drizzle ORM

Drizzle será utilizado como camada type-safe de acesso ao PostgreSQL.

O uso do Drizzle deve permanecer simples e próximo do SQL.

Não criar repositories, services ou abstrações adicionais apenas por padrão arquitetural.

## 14.3 Identificadores

## 14.3 Identificadores

Usar UUID.

## 14.4 Timestamps

Usar timestamps com timezone.

## 14.5 Valores monetários

Usar `numeric`, evitando `float`.

## 14.6 Foreign Keys

Criar foreign keys apropriadas.

## 14.7 Índices

Criar índices para:

- organization_id;
- foreign keys usadas em consultas;
- campos de filtro relevantes;
- timestamps usados em dashboards quando necessário.

Não criar índices indiscriminadamente.

## 14.8 Unique Constraints

Usar quando representarem regra real do domínio.

## 14.9 Soft delete

Não utilizar por padrão.

Adicionar somente quando houver necessidade concreta.

## 14.10 Migrations

Todas as alterações de banco devem ocorrer por migrations versionadas.

Nunca editar manualmente o banco como substituição das migrations.

---

# 15. Estrutura do Projeto

```text
revenueflow/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   │
│   └── (dashboard)/
│       ├── dashboard/
│       ├── leads/
│       ├── customers/
│       ├── pipeline/
│       ├── appointments/
│       ├── follow-ups/
│       ├── team/
│       └── settings/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── dashboard/
│
├── features/
│   ├── customers/
│   ├── leads/
│   ├── opportunities/
│   ├── appointments/
│   ├── follow-ups/
│   └── revenue/
│
├── lib/
│   ├── db/
│   ├── validations/
│   └── utils/
│
├── types/
│
├── db/
│   ├── migrations/
│   └── seed.sql
│
├── e2e/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── ROADMAP.md
│   └── DECISIONS.md
│
├── public/
├── .env.example
├── README.md
├── package.json
└── ...
```

A estrutura pode evoluir. Não criar diretórios vazios ou camadas sem necessidade.

---

# 16. Documentação

Criar:

- README.md
- docs/ARCHITECTURE.md
- docs/DATABASE.md
- docs/SECURITY.md
- docs/ROADMAP.md
- docs/DECISIONS.md

## 16.1 DECISIONS.md

Decisões importantes devem registrar:

```text
Problema
Alternativas
Decisão
Motivo
Consequências
```

---

# 17. Git

Commits pequenos e claros.

Padrão:

```text
feat: initialize RevenueFlow application
feat: add PostgreSQL/Better Auth authentication
feat: add organization multi-tenancy
feat: implement customer management
feat: implement lead pipeline
test: add tenant isolation e2e tests
fix: enforce organization membership validation
```

Antes de alterações relevantes:

1. verificar git status;
2. verificar branch;
3. analisar alterações existentes;
4. não apagar trabalho sem entender seu propósito.

---

# 18. Ambientes

O MVP deve considerar:

- development;
- staging;
- production como conceito futuro.

Não conectar testes destrutivos a banco de produção.

Para E2E, preferir projeto PostgreSQL/Better Auth separado ou banco isolado de teste.

Como o MVP não será publicado em produção, não criar infraestrutura de produção agora.

---

# 19. Testes

## 19.1 E2E

Playwright deve cobrir progressivamente:

### Auth

- signup;
- login;
- logout.

### Organizations

- criação;
- membership.

### Tenant isolation

Teste obrigatório:

```text
Tenant A
    X
Tenant B
```

Um usuário de A não pode:

- visualizar clientes de B;
- visualizar leads de B;
- visualizar oportunidades de B;
- visualizar agendamentos de B;
- visualizar follow-ups de B;
- visualizar receitas de B.

## 19.2 Domínio

Testar regras importantes como:

- cálculo da taxa de conversão;
- classificação de receita recuperada;
- regras de attribution.

## 19.3 Validação

Antes de considerar uma etapa concluída, executar quando aplicável:

```text
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test
```

Os scripts reais devem ser definidos de acordo com a configuração do projeto.

Nunca afirmar que um teste passou sem executá-lo.

---

# 20. Roadmap do MVP

## Fase 0 — Especificação e Fundação

- SPEC;
- context;
- arquitetura;
- banco;
- segurança;
- documentação;
- configuração de desenvolvimento.

## Fase 1 — Next.js

- criar aplicação;
- TypeScript;
- Tailwind;
- shadcn;
- ESLint;
- estrutura inicial.

## Fase 2 — PostgreSQL/Better Auth Auth

- conexão;
- login;
- signup;
- logout;
- sessão;
- proteção de rotas.

## Fase 3 — Multi-tenancy

- organizations;
- profiles;
- memberships;
- roles;
- RLS;
- policies;
- testes de isolamento.

## Fase 4 — Layout

- sidebar;
- header;
- dashboard shell;
- responsividade;
- estados de loading/empty/error.

## Fase 5 — Customers

- listagem;
- criação;
- edição;
- detalhes.

## Fase 6 — Leads e Pipeline

- leads;
- opportunities;
- stages;
- pipeline;
- conversão de lead.

## Fase 7 — Operação

- services;
- professionals;
- appointments.

## Fase 8 — Follow-ups

- criação manual;
- pendentes;
- atrasados;
- concluídos;
- outcomes.

## Fase 9 — Revenue

- conversions;
- revenue_events;
- attribution;
- métricas financeiras.

## Fase 10 — Dashboard

- KPIs;
- pipeline;
- receita;
- receita recuperada;
- follow-ups;
- atividades.

## Fase 11 — E2E

- fluxos completos;
- isolamento multi-tenant;
- regressões.

---

# 21. Funcionalidades Futuras

Fora do MVP:

```text
WhatsApp Business Platform
Instagram
Meta
IA/LLMs
agentes
automations engine
campaigns
calendar integrations
PIX/payments
CRM integrations
voice agents
billing
subscriptions
```

Essas funcionalidades deverão ser introduzidas como mudanças planejadas, nunca como alterações improvisadas.

---

# 22. OpenSpec + TLC Spec-Driven Development

O projeto utiliza dois processos complementares.

## 22.1 TLC Spec-Driven Development

**TLC é o mecanismo de planejamento e execução do desenvolvimento.**

Responsabilidades:

- analisar tarefas;
- decompor trabalho;
- definir plano de implementação;
- identificar arquivos afetados;
- identificar dependências;
- definir critérios de aceitação;
- executar alterações de forma incremental;
- validar;
- registrar conclusão.

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

TLC deve ser usado para decidir **como desenvolver**.

## 22.2 OpenSpec

**OpenSpec é exclusivamente utilizado para documentar o desenvolvimento e mudanças significativas.**

OpenSpec não substitui o TLC.

OpenSpec não deve ser usado como segundo sistema de planejamento.

Fluxo:

```text
Mudança significativa
        ↓
OpenSpec
        ↓
documentação da mudança
        ↓
implementação
        ↓
registro/consolidação
```

O OpenSpec serve para manter histórico e documentação estruturada das mudanças.

## 22.3 Regra de separação

```text
SPEC.md
    ↓
define O QUE o produto é

TLC
    ↓
define COMO planejar e executar o trabalho

OpenSpec
    ↓
documenta AS MUDANÇAS realizadas
```

Não duplicar requisitos completos entre os três.

## 22.4 Mudanças pequenas

Para pequenas correções:

```text
TLC
→ task
→ implementação
→ teste
```

OpenSpec só deve ser utilizado quando a mudança justificar documentação formal.

## 22.5 Mudanças significativas

Para alterações arquiteturais ou de domínio:

```text
TLC
→ planejamento
→ OpenSpec para documentar mudança
→ implementação
→ testes
→ atualização da documentação
```

## 22.6 Regra contra duplicação

Se uma informação já pertence ao SPEC.md, não copiar integralmente para OpenSpec ou context.md.

Use referências conceituais.

---

# 23. Critérios Gerais de Aceitação

Uma funcionalidade só deve ser considerada concluída quando:

- comportamento esperado implementado;
- validação server-side implementada;
- autorização verificada;
- RLS preservado;
- TypeScript sem erros;
- lint sem erros relevantes;
- testes aplicáveis executados;
- build executado quando aplicável;
- UX básica validada;
- documentação atualizada quando necessário.

---

# 24. Definition of Done

Uma task está concluída quando:

1. código implementado;
2. nenhum requisito crítico conhecido foi ignorado;
3. segurança revisada;
4. multi-tenancy revisado;
5. erros tratados;
6. testes aplicáveis executados;
7. typecheck executado;
8. lint executado;
9. build executado quando aplicável;
10. documentação atualizada quando a mudança exigir;
11. estado do Git revisado.

---

# 25. Regra Final

RevenueFlow deve permanecer simples.

A prioridade é:

1. segurança;
2. simplicidade;
3. velocidade de desenvolvimento;
4. experiência do usuário;
5. capacidade de evolução.

Não adicionar complexidade apenas para preparar um cenário que ainda não existe.


# Backend Stack Contract

O backend do RevenueFlow deve permanecer dentro do Next.js.

Componentes oficiais:

- **Next.js Server:** runtime e backend da aplicação;
- **Server Actions:** mutações internas e operações acionadas pela UI;
- **Route Handlers:** endpoints HTTP necessários para integrações, webhooks ou APIs;
- **Better Auth:** autenticação e sessão;
- **Zod:** validação server-side;
- **Drizzle ORM:** acesso type-safe ao PostgreSQL;
- **PostgreSQL:** persistência.

Regra:

```text
HTTP/UI
 ↓
Better Auth
 ↓
Zod
 ↓
Authorization
 ↓
Domain logic
 ↓
Drizzle
 ↓
PostgreSQL
```

Nenhum Client Component deve acessar o banco diretamente.

Nenhum segredo de banco/autenticação deve chegar ao cliente.
