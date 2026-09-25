# Design: Services, Professionals & Appointments

## Architecture & Data Flow
Seguindo o padrao Next.js Monolith com Server Components e Server Actions:

1. **Acesso a Dados & Drizzle Schema:**
   - `services`: preco como `numeric(10, 2)` formatado, duracao em minutos (inteiro positivo).
   - `professionals`: entidade operacional que pode ou nao estar ligada a um `user` do sistema.
   - `appointments`: relacionamento tripartite obrigando `organization_id` compativel em todas as entidades filhas.
   - Indices em `organization_id`, `scheduled_at`, `professional_id`, `customer_id` e `service_id`.

2. **Tenant Scoping & Security:**
   - Invocacao obrigatoria de `requireSession()` e `requireOrganization()` em todas as acoes.
   - Validacao relacional no servidor: ao criar/atualizar agendamento, o sistema busca `Customer`, `Service` e `Professional` validando `item.organizationId === activeContext.organization.id`. Se qualquer um for de outro tenant, a operacao e rejeitada com `400/403`.
   - Validacao de conflito de agenda: verifica se o mesmo profissional ja possui agendamento ativo (`scheduled` ou `confirmed`) no mesmo horario exato dentro da organizacao.

3. **Validacao Zod:**
   - Preco de servico positivo ou zero, duracao positiva (1 a 1440 min).
   - Nome de profissional obrigatorio.
   - Data/hora de agendamento valida (`scheduled_at`).
   - Status de agendamento enum: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`.

4. **Interface Web:**
   - Telas padronizadas no App Router com formularios `useTransition`, badges de status, cards e tabelas responsivas.