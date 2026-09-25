# Spec: Follow-ups Management

## Purpose
Prover o registro, acompanhamento, conclusao e cancelamento de tarefas de follow-up com Leads e Clientes, com estrito isolamento por organizacao.

## Requirements
- `follow_ups`: vinculado obrigatoriamente a uma `organization` e opcionalmente a `customer_id` e/ou `lead_id` (pelo menos um contexto obrigatorio).
- Enums:
  - Tipo: `price_follow_up`, `quote_follow_up`, `reactivation`, `appointment_follow_up`, `general`
  - Status: `pending`, `completed`, `cancelled`
  - Canal: `manual`, `phone`, `email`, `whatsapp`, `other`
- Filtros temporais:
  - Hoje: `scheduled_at` no dia de hoje e status `pending`
  - Atrasados: `scheduled_at < inicio do dia de hoje` e status `pending`
  - Próximos: `scheduled_at > fim do dia de hoje` e status `pending`
  - Concluídos: status `completed`
  - Todos: todos os follow-ups da organização
- Conclusão com gravação de `outcome` e `executed_at` no servidor.