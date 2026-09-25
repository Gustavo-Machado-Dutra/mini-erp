# Spec: Leads & Pipeline Management

## Purpose
Gerenciar a entrada, qualificacao e avanco de oportunidades comerciais (Leads) atraves de um funil de estagios (Pipeline) estruturado e com estrito isolamento organizacional.

## Requirements

### Data Model
- Entidade `leads` contem: `id`, `organization_id` (FK -> organizations.id), `customer_id` (FK -> customers.id, opcional), `name`, `email`, `phone`, `source`, `stage` (enum: new, contacted, interested, scheduled, converted, lost), `notes`, `created_at`, `updated_at`, `created_by` (FK -> user.id).
- Indices em `organization_id`, `(organization_id, stage)`, `(organization_id, created_at)` e `customer_id`.

### Multi-Tenancy & Authorization
- Toda operacao (create, read, update, change stage) DEVE verificar sessao e pertencer a organizacao ativa.
- Tentativas de associar um Lead a um Customer pertencente a outra organizacao DEVEM ser bloqueadas no servidor.
- Consultas por ID aplicam match duplo por `id` e `organization_id` autorizado para neutralizar IDOR.
- `organization_id` e `created_by` sao determinados estritamente pelo servidor.

### Pipeline Stages
- `new`: Lead recem-chegado / oportunidade aberta.
- `contacted`: Primeiro contato realizado.
- `interested`: Lead demonstrou interesse / qualificado.
- `scheduled`: Agendamento realizado / visita marcada.
- `converted`: Oportunidade ganha / convertido em cliente ativo.
- `lost`: Oportunidade perdida / sem interesse.

### User Experience
- Rota `/leads`: visualizacao em formato Pipeline (Kanban simples) e formato Lista, com busca e contadores por estagio.
- Rota `/leads/new`: formulario acessivel para cadastrar lead e opcionalmente vincular a um cliente existente da organizacao.
- Rota `/leads/[id]`: ficha detalhada com troca rapida de estagio, informacoes de contato e notas.
- Rota `/leads/[id]/edit`: formulario para alteracao dos dados cadastrais.