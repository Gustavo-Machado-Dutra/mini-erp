# Design: Leads & Pipeline Domain

## Architecture & Data Flow
A arquitetura segue o padrao Next.js Monolith com Server Components e Server Actions:

1. **Acesso a Dados & Drizzle Schema:**
   - Tabela `leads`: `id`, `organization_id` (FK -> organizations.id CASCADE), `customer_id` (FK -> customers.id SET NULL, opcional), `name`, `email`, `phone`, `source`, `stage` (enum: new, contacted, interested, scheduled, converted, lost), `notes`, `created_at`, `updated_at`, `created_by` (FK -> user.id SET NULL).
   - Indices em `organization_id`, `(organization_id, stage)`, `(organization_id, created_at)` e `customer_id`.

2. **Tenant Scoping & Security:**
   - Invocacao obrigatoria de `requireSession()` e `requireOrganization()` em toda operacao.
   - `organizationId` e `createdBy` injetados exclusivamente a partir do contexto seguro do servidor.
   - Verificacao de chave estrangeira cross-tenant: caso um `customerId` seja informado na criacao/edicao do Lead, o backend valida que `customer.organization_id === activeContext.organization.id`. Se pertencer a outro tenant, a requisicao e bloqueada com erro 400/403.
   - Consultas pontuais realizam match duplo `WHERE leads.id = :id AND leads.organization_id = :orgId` para neutralizar IDOR.

3. **Validacao Zod:**
   - `name`: obrigatorio (2 a 200 caracteres, aparado).
   - `email`: opcional, formato valido quando presente.
   - `phone`: opcional, max 50 caracteres.
   - `source`: opcional, max 100 caracteres (ex: 'Instagram', 'Google', 'Indicacao', 'Site').
   - `stage`: enum obrigatorio ('new', 'contacted', 'interested', 'scheduled', 'converted', 'lost').
   - `customerId`: opcional, string.
   - `notes`: opcional, max 2000 caracteres.

4. **Server Actions:**
   - `createLeadAction`: cria lead garantindo tenant scoping e validacao de customerId.
   - `updateLeadAction`: atualiza dados cadastrais do lead.
   - `updateLeadStageAction`: atualiza especificamente o estagio do lead de forma rapida e segura.

5. **Interface Web (App Router):**
   - `/leads`: visualizacao flexivel com chaveamento entre Pipeline (Funnel Kanban) e Lista tabular, com busca e contadores por estagio.
   - `/leads/new`: formulario de criacao com selecao opcional de cliente cadastrado.
   - `/leads/[id]`: ficha detalhada do lead com botao/dropdown de transicao rapida de estagio, informacoes de contato, notas e link para o cliente correspondente.
   - `/leads/[id]/edit`: formulario de edicao de dados.