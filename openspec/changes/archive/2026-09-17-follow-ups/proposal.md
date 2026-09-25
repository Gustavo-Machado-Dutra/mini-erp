# Proposal: Follow-ups Domain & Activity Management

## Why
Follow-up e a entidade central do RevenueFlow para recuperacao de clientes, leads e oportunidades perdidas. Para evitar perda de contato e viabilizar a atribuicao de receita futura, e necessario permitir o agendamento, acompanhamento, conclusao com registro de desfecho (outcome) e cancelamento de contatos comerciais manuais para Leads e Clientes.

## What Changes
- Definir tabela Drizzle `follow_ups`: `id`, `organization_id`, `customer_id` (nullable FK), `lead_id` (nullable FK), `type` (enum), `status` (enum: pending, completed, cancelled), `channel` (enum: manual, phone, email, whatsapp, other), `scheduled_at`, `executed_at` (nullable), `outcome` (nullable), `notes` (nullable), timestamps e `created_by`.
- Implementar validacao Zod garantindo que pelo menos um contexto comercial valido (`customer_id` ou `lead_id`) esteja presente e que pertença a organizacao ativa.
- Implementar Server Actions para criar, editar (pendentes), marcar como concluido (`completed` com `outcome` e `executed_at` server-side) e cancelar (`cancelled`).
- Desenvolver queries server-side para listagem com filtros temporais: Hoje, Atrasados, Proximos, Concluidos e Todos.
- Construir interface Web App Router (`/follow-ups`, `/follow-ups/new`, `/follow-ups/[id]`, `/follow-ups/[id]/edit`) com badges, formulario e transicao rapida de desfecho.
- Atualizar `Sidebar` com link para `/follow-ups`.
- Criar suite de testes automatizados cobrindo isolamento multi-tenant, IDOR, filtros temporais e integridade cross-tenant.

## Non-goals
- Nao implementar automacoes de disparo, integracao direta com API de WhatsApp, envio de e-mails em background ou IA nesta etapa.
- Nao implementar conversations/chat inbox.