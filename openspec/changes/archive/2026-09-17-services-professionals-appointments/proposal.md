# Proposal: Services, Professionals & Appointments Operations

## Why
Com os modulos de Clientes (Fase 5) e Leads/Pipeline (Fase 6) concluidos, o RevenueFlow necessita do dominio operacional: catalogo de Servicos (`services`), quadro de Profissionais (`professionals`) e gestao de Agendamentos (`appointments`). Essa camada conecta clientes a prestacoes de servico executadas por profissionais da organizacao.

## What Changes
- Definir tabelas Drizzle:
  - `services`: `id`, `organization_id`, `name`, `description`, `duration_minutes`, `price` (numeric), `active`, timestamps, `created_by`.
  - `professionals`: `id`, `organization_id`, `user_id` (nullable), `name`, `email`, `phone`, `active`, timestamps, `created_by`.
  - `appointments`: `id`, `organization_id`, `customer_id`, `professional_id`, `service_id`, `scheduled_at`, `status` (enum: scheduled, confirmed, completed, cancelled, no_show), `notes`, timestamps, `created_by`.
- Implementar validacoes Zod e tipagem TypeScript para cada entidade.
- Validar relacionamentos server-side: garantir que `Customer`, `Service` e `Professional` pertencem estritamente a mesma `Organization` ativa no momento de criar/editar `Appointment`.
- Adicionar protecao basica contra conflito de horario de profissional no servidor.
- Criar Server Actions e queries server-side tenant-scoped para listagem, criacao, edicao e ativacao/desativacao.
- Construir interface App Router:
  - `/services`: lista com busca, criacao, edicao e alternancia de status ativo.
  - `/professionals`: lista com busca, criacao, edicao e alternancia de status ativo.
  - `/appointments`: agenda organizada por abas (Hoje, Proximos, Atrasados, Todos), criacao com selecao relacional, edicao e transicao de status.
- Atualizar Sidebar para incluir Servicos, Profissionais e Agenda.
- Criar suite de testes automatizados de dominio e isolamento multi-tenant cobrindo integridade relacional cross-tenant e prevencao de IDOR.

## Non-goals
- Nao implementar integracao com Google Calendar, Outlook ou bibliotecas pesadas de calendario.
- Nao implementar pagamentos, split ou faturamento online.
- Nao implementar motor complexo de regras de disponibilidade ou recorrencia de agendamentos.