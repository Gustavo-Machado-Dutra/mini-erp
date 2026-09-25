# Decisoes Arquiteturais Ã¢â‚¬â€ RevenueFlow

> Formato: Problema Ã¢â€ â€™ Alternativas Ã¢â€ â€™ Decisao Ã¢â€ â€™ Motivo Ã¢â€ â€™ Consequencias

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
- O MVP nao vai a producao Ã¢â‚¬â€ nao ha justificativa para complexidade operacional.
- Server Components + Server Actions eliminam a necessidade de uma API REST separada para a maioria dos casos.
- A separacao por modulos em src/modules/ permite extrair servicos no futuro sem reescrever tudo.

### Consequencias

- Toda a logica de negocio fica no mesmo repositorio e processo Ã¢â‚¬â€ facil de desenvolver e debugar.
- Escalar horizontalmente exige cuidado com estado local (sem estado local relevante no MVP).
- Se o produto crescer muito, a migraÃƒÂ§ÃƒÂ£o para servicos sera feita modulo por modulo.

---

## ADR-002: Drizzle ORM com PostgreSQL

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Escolher ORM/query builder para acesso ao PostgreSQL.

### Alternativas

1. **Prisma**: mais popular, mas gera codigo em runtime, tem um client pesado e usa um schema DSL proprio.
2. **Drizzle ORM**: type-safe, schema em TypeScript puro, sem geraÃƒÂ§ÃƒÂ£o em runtime, leve.
3. **SQL puro**: maximo controle, mas sem type-safety e propenso a SQL injection sem disciplina.

### Decisao

Drizzle ORM.

### Motivo

- Especificado no spec.md e context.md.
- Schema em TypeScript: o banco e o codigo ficam sincronizados via tipos.
- Nao gera codigo em runtime Ã¢â‚¬â€ sem surpresas no build.
- drizzle-kit gera migrations de forma controlada.

### Consequencias

- Migrations devem ser geradas explicitamente com 
px drizzle-kit generate.
- O schema TypeScript e a fonte de verdade do banco Ã¢â‚¬â€ qualquer alteraÃƒÂ§ÃƒÂ£o no banco passa pelo schema.

---

## ADR-003: Better Auth para autenticaÃƒÂ§ÃƒÂ£o e sessao

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
- Organizations plugin do Better Auth implementa multi-tenancy de forma nativa Ã¢â‚¬â€ alinha direto com o requisito de isolamento de tenants.
- Adapter Drizzle oficial Ã¢â‚¬â€ schema do banco e gerado automaticamente.
- Nao exige PostgreSQL/Supabase como backend Ã¢â‚¬â€ roda no servidor Next.js.

### Consequencias

- A configuraÃƒÂ§ÃƒÂ£o de providers (Google, GitHub, email) sera feita na Fase 2.
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
- Os componentes sao codigo do projeto Ã¢â‚¬â€ sem lock-in de dependencia.
- IntegraÃƒÂ§ÃƒÂ£o nativa com Tailwind CSS.
- Acessibilidade via Radix UI.
- Facil customizacao sem overrides CSS complexos.

### Consequencias

- Componentes sao adicionados sob demanda via 
px shadcn add <component>.
- O estilo padrao pode ser customizado editando diretamente os arquivos em src/components/ui/.

## ADR-005: Nao utilizar o plugin Organizations do Better Auth

**Data:** 2026-09-17
**Status:** Aceito

### Problema

O RevenueFlow e um SaaS B2B multi-tenant que necessita de isolamento de dados por organizacao. O Better Auth oferece um plugin oficial 'Organizations'.

### Alternativas

1. **Usar plugin Organizations do Better Auth:** rapido, mas dita a estrutura do banco e como roles sao verificadas, espalhando essas regras para o cliente de auth.
2. **Construir tabelas customizadas de Organization (via Drizzle):** mantem o dominio (User, Profile, Organization, Organization Member) 100% aderente ao definido no spec.md. O Better Auth e usado apenas para Sessao e User Login.

### Decisao

Alternativa 2. O plugin Organizations do Better Auth NAO sera utilizado no MVP (Fase 2 nem Fase 3). O Better Auth sera limitado estritamente as tabelas de `user`, `session`, `account` e `verification`.

### Motivo

- O `spec.md` define que a organizacao tem um dominio proprio e as regras de negocio determinam quais organizacoes um usuario acessa.
- O plugin Organizations forca uma convencao de schema (ex: `member` vs `organization_members`) e de logica que cria atrito com o dominio ja desenhado para o PostgreSQL.
- Auth tem uma finalidade primaristica: "quem voce e". O "que organizacao voce acessa" e de autorizacao de dominio, e devera ficar no Drizzle logic.

### Consequencias

- A Fase 3 implementara a multi-tenancy usando Server Actions para validar auth-session contra as tabelas costumizadas `organizations` e `organization_members`.

---

## ADR-006: Modelo de Multi-Tenancy e Isolamento Server-Side

**Data:** 2026-09-17
**Status:** Aceito

### Problema

Definir a arquitetura de isolamento multi-tenant do RevenueFlow e como a associacao de usuarios e organizacoes sera autorizada e resolvida no servidor.

### Alternativas

1. **Supabase RLS / DB Policies exclusivas:** requer PostgreSQL gerenciado com sessions especificas, acopla o backend a infraestrutura de terceiros e dificulta testes locais offline.
2. **Coluna `organization_id` na tabela de usuario:** impede que um usuario participe de multiplas empresas no futuro.
3. **Membership Drizzle + Tenant Context Server-Side:** tabela `organization_members` intermediaria associando `userId` e `organizationId` com papeis (`owner`, `admin`, `member`), e helpers server-side (`requireOrganization`) que validam membership ativamente a cada requisicao antes de qualquer query de negocio.

### Decisao

Alternativa 3. O isolamento de dados do RevenueFlow baseia-se em:
- Tabela `organization_members` com constraint unica `(organization_id, user_id)`.
- Funcoes server-side de validacao estrita (`requireSession`, `requireOrganization`, `requireOrganizationRole`).
- Resolucao de tenant ativo via cookie seguro ou parametro validado atomicamente contra `organization_members`.
- Queries Drizzle explicitamente escopadas com `organizationId` validado no backend.

### Motivo

- Total conformidade com `spec.md` e simplicidade sem overengineering.
- Previne vulnerabilidades de IDOR (Insecure Direct Object Reference) ja que nenhum identificador de organizacao enviado pelo browser e aceito como prova de permissao.
- Permite que um usuario pertenca a varias organizacoes com papeis diferentes em cada uma.

### Consequencias

- Toda Server Action e Route Handler de dominio deve obrigatoriamente chamar `requireOrganization` ou `requireOrganizationRole`.
- A suite de testes automatizada `tests/tenancy/isolation.test.ts` valida e documenta as garantias de isolamento.

---

## ADR-007: AusÃƒÂªncia de exclusÃƒÂ£o fÃƒÂ­sica de Customers na Fase 5
**Data:** 2026-09-17
**Status:** Aceito

### Problema
Decidir sobre a implementaÃƒÂ§ÃƒÂ£o de exclusÃƒÂ£o (fÃƒÂ­sica ou lÃƒÂ³gica) de clientes (`customers`) na Fase 5 do MVP.

### Alternativas
1. **ExclusÃƒÂ£o fÃƒÂ­sica direta (DELETE CASCADE):** simples de implementar no curto prazo, mas arrisca quebrar a integridade referencial com mÃƒÂ³dulos subsequentes (Leads, Opportunities, Appointments, Conversions, Revenue) e destrÃƒÂ³i o histÃƒÂ³rico financeiro e de auditoria da organizaÃƒÂ§ÃƒÂ£o.
2. **Soft delete prematuro (coluna `deleted_at`):** adiciona complexidade a todas as consultas e ÃƒÂ­ndices antes de conhecer as regras de retenÃƒÂ§ÃƒÂ£o e arquivamento de clientes.
3. **NÃƒÂ£o implementar exclusÃƒÂ£o no MVP inicial (Fase 5):** Clientes sÃƒÂ£o entidades centrais de relacionamento. O usuÃƒÂ¡rio pode cadastrar, consultar e atualizar os dados cadastrais. A exclusÃƒÂ£o/inativaÃƒÂ§ÃƒÂ£o serÃƒÂ¡ definida com regras de negÃƒÂ³cio claras nas fases de pipeline e receita.

### DecisÃƒÂ£o
Alternativa 3. A exclusÃƒÂ£o fÃƒÂ­sica ou lÃƒÂ³gica de `customers` nÃƒÂ£o ÃƒÂ© implementada na Fase 5.

### Motivo
- Em conformidade com o princÃƒÂ­pio de "Simplicidade Primeiro" e orientaÃƒÂ§ÃƒÂµes do `spec.md`.
- Clientes sÃƒÂ£o entidades ÃƒÂ¢ncora de dados transacionais e financeiros futuros; exclusÃƒÂ£o prematura geraria inconsistÃƒÂªncias nos relatÃƒÂ³rios de conversÃƒÂ£o e receita recuperada.

### ConsequÃƒÂªncias
- A Fase 5 entrega as operaÃƒÂ§ÃƒÂµes de CriaÃƒÂ§ÃƒÂ£o, VisualizaÃƒÂ§ÃƒÂ£o detalhada, Listagem com Busca e EdiÃƒÂ§ÃƒÂ£o com validaÃƒÂ§ÃƒÂ£o Zod e isolamento multi-tenant estrito.
- Futuras fases poderÃƒÂ£o introduzir arquivamento/inativaÃƒÂ§ÃƒÂ£o de clientes caso haja requisito explÃƒÂ­cito no `spec.md`.
---

## ADR-008: Modelo Unificado de Leads e Pipeline no MVP
**Data:** 2026-09-17
**Status:** Aceito

### Problema
Definir como estruturar a captura de leads e o funil comercial no MVP: se como tabelas separadas para Leads e Oportunidades (`opportunities`) ou em um modelo coeso e direto.

### Alternativas
1. **Tabelas separadas para Leads e Opportunities desde o inÃ­cio:** cria duas tabelas quase idÃªnticas no MVP, exigindo sincronizaÃ§Ã£o prematura, mÃºltiplos formulÃ¡rios e atrito operacional sem ganho real para o usuÃ¡rio final.
2. **Pipelines configurÃ¡veis dinamicamente pelo usuÃ¡rio (Pipeline Builder):** adiciona complexidade desproporcional (tabelas de pipelines, stages, ordenaÃ§Ã£o) antes de validar o produto no nicho de clÃ­nicas e empresas de serviÃ§os.
3. **Entidade `leads` com estÃ¡gios explÃ­citos (`lead_stage`) e vÃ­nculo opcional a `customers`:** modelo enxuto e orientado a dados com estÃ¡gios fixos (`new`, `contacted`, `interested`, `scheduled`, `converted`, `lost`), permitindo listagem tabular e visÃ£o em pipeline (Kanban).

### DecisÃ£o
Alternativa 3. O funil comercial do MVP utiliza a tabela `leads` com enum `lead_stage` e relacionamento opcional com `customers`.

### Motivo
- Atende 100% aos requisitos de rastreabilidade de oportunidades comerciais do `spec.md`.
- Reduz complexidade de queries e mutaÃ§Ãµes, mantendo performance elevada e isolamento multi-tenant limpo.
- A arquitetura orientada por dados permite posterior expansÃ£o para mÃºltiplos pipelines sem quebrar a integridade do banco.

### ConsequÃªncias
- A interface de `/leads` disponibiliza chaveamento imediato entre visualizaÃ§Ã£o de Funil (Pipeline) e Lista.
- AlteraÃ§Ãµes de estÃ¡gio ocorrem atomicamente via Server Action `updateLeadStageAction`.
---

## ADR-009: Gestão Operacional de Serviços, Profissionais e Agendamentos no MVP
**Data:** 2026-09-17
**Status:** Aceito

### Problema
Modelar e integrar a execução operacional (serviços prestados, profissionais e agendamentos) mantendo integridade relacional multi-tenant e prevenindo conflitos de horário.

### Alternativas
1. **Modelos complexos de disponibilidade, recorrência e integração com calendários externos (Google/Outlook):** adiciona alto acoplamento, complexidade de sync e latência de rede antes de consolidar as regras de conversão do produto.
2. **Campos soltos em texto livre nos agendamentos:** rápido, mas não permite análise de faturamento por serviço ou profissional nem histórico de clientes.
3. **Tabelas relacionais `services`, `professionals` e `appointments` tenant-scoped com validação atômica de pertencimento:** serviços com preço decimal e duração, profissionais operacionais e agendamentos vinculando cliente, serviço e profissional, com validação de conflito de horário no servidor.

### Decisão
Alternativa 3. O módulo operacional utiliza as tabelas `services`, `professionals` e `appointments` com estrita validação de organização única nas entidades filhas e checagem de conflitos para o mesmo profissional.

### Motivo
- Em conformidade com o `spec.md` (Seções 8.5, 8.6, 8.7).
- Garante total integridade referencial para os futuros módulos de Follow-ups e Receita/Conversões.
- Previne conflitos de agendamento no mesmo horário para o mesmo profissional.

### Consequências
- A criação de agendamentos exige que Cliente, Serviço e Profissional pertençam à mesma organização ativa.
- A página `/appointments` organiza os agendamentos em abas temporais (Hoje, Próximos, Atrasados, Todos) sem dependência de bibliotecas externas pesadas.
---

## ADR-010: Gestão Manual de Follow-ups e Registro de Desfecho no MVP
**Data:** 2026-09-17
**Status:** Aceito

### Problema
Modelar o acompanhamento comercial de contatos futuros (orçamentos pendentes, reativação de clientes, confirmações de atendimento e dúvidas de leads) garantindo rastreabilidade sem antecipar integrações complexas de mensageria externa ou motores de automação.

### Alternativas
1. **Motor de automação com filas (Redis/BullMQ) e integração direta com APIs de WhatsApp/Email:** complexidade operacional massiva para a fase de MVP, adicionando dependências externas e custos de infraestrutura prematuros.
2. **Sistema genérico de tarefas/tarefas livres:** perde o contexto comercial de clientes, leads e canais de contato, dificultando relatórios de conversão e métricas de funil.
3. **Entidade de domínio `follow_ups` com tipos e canais explícitos, vínculo a Customer/Lead e registro obrigatório de desfecho (`outcome`):** modelo estruturado, 100% manual no MVP, com validação de multi-tenancy e marcação de `executedAt` e `outcome` no servidor ao concluir o contato.

### Decisao
Alternativa 3. O módulo de follow-ups utiliza a tabela `follow_ups` com enums de tipo (`follow_up_type`), status (`follow_up_status`) e canal (`follow_up_channel`), exigindo vínculo com um cliente ou lead da mesma organização.

### Motivo
- Em estrita conformidade com o `spec.md` (Seção 8.8) e princípios de simplicidade.
- Disponibiliza visão operacional rápida dividida por períodos (Hoje, Atrasados, Próximos, Concluídos, Todos).
- Prepara o terreno para atribuição de conversão e receita na Fase 9 e automações na Fase 10 sem necessidade de refatorações estruturais.

### Consequencias
- Criação, edição, conclusão e cancelamento de follow-ups são executados via Server Actions com validação Zod.
- Conclusão de follow-up exige o preenchimento de `outcome` e registra o timestamp exato de execução no servidor.
---
## ADR-011: Schema de Conversões e Receita alinhado à SPEC + regra de atribuição do MVP
**Data:** 2026-09-25
**Status:** Aceito
### Problema
As tabelas `conversions` e `revenue` (criadas na migration 0004) divergiam dos campos conceituais da SPEC (seções 8.11, 8.12 e 10): `conversions` tinha `type` genérico e não tinha `attribution_type`, `amount`, `converted_at`, `notes`; `revenue` não tinha `currency`, `source`, `status`, `occurred_at` nem vínculo com `conversion_id`.
### Alternativas
1. Manter o schema atual e tratar atribuição apenas na camada de UI: rápido, mas sem evidência persistida e sem suporte a "receita recuperada" de forma verificável.
2. Adicionar campos novos sem renomear (`type` e `paid_at` continuariam): evita renames, mas mantém nomenclatura divergente da SPEC.
3. Alinhar o schema à SPEC via migration versionada, preservando dados existentes com `RENAME COLUMN`: colunas finais `attribution_type`, `amount`, `converted_at`, `notes` em `conversions`; `currency`, `source`, `status`, `occurred_at`, `conversion_id` em `revenue`.
### Decisão
Alternativa 3, aplicada na migration `0005_conversions_revenue_spec.sql` (renames preservam o único registro de receita existente no ambiente de dev). A entidade "opportunity" da SPEC continua representada por `leads` (ADR-008), então `conversions.lead_id` cumpre o papel de `opportunity_id`.
### Motivo
- A SPEC exige que a receita recuperada dependa de evidência registrada (`attribution_type` na conversão), e que valores monetários usem `numeric` (mantido).
- A regra de atribuição do MVP (SPEC 10.2/10.3) é determinística: apenas `follow_up_conversion` e `reactivation_conversion` contam como receita recuperada; `direct_conversion`, `manual_conversion` e `unknown` não contam. Não há modelo estatístico.
### Consequências
- `revenue` só é contabilizada como recuperada quando vinculada a uma conversão com tipo de atribuição elegível; receita sem conversão ou com atribuição manual/desconhecida permanece como "registrada" / "sem atribuição" no dashboard.
- Dashboard separa receita registrada vs recuperada usando a mesma regra (`isRecoveredAttributionType` em `src/modules/conversions/types.ts`).
- Identidade de colunas alinhada: `occurred_at`, `attribution_type`, `source`, `status` (convertidos em enums PostgreSQL).
