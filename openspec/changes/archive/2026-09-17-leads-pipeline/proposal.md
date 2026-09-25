# Proposal: Leads & Commercial Pipeline Domain

## Why
A Fase 5 estabeleceu o dominio de Clientes (Customer Management). Para que o RevenueFlow atinja sua proposta central de recuperacao e conversao comercial, e necessario implementar o primeiro funil comercial: captura e acompanhamento de Leads atraves de estagios estruturados do Pipeline (Novo, Contato, Interessado, Agendado, Convertido e Perdido).

## What Changes
- Definir a tabela Drizzle `leads` com isolamento multi-tenant (`organization_id`), relacao opcional com `customers` (`customer_id`), estagios (`lead_stage`), origem (`source`), timestamps e rastreabilidade (`created_by`).
- Implementar schemas Zod para validacao estrita de entradas na criacao, edicao e alteracao de estagio.
- Desenvolver Server Actions tenant-scoped com validacao de membership e protecao contra associacao cross-tenant de clientes.
- Desenvolver queries server-side para listagem com busca, contagem por estagios e recuperacao de lead por ID com protecao IDOR.
- Construir a interface Web no App Router (`/leads`, `/leads/new`, `/leads/[id]`, `/leads/[id]/edit`) suportando visualizacao em Lista e em Pipeline Funnel (colunas por estagio).
- Criar suite completa de testes automatizados de dominio e isolamento multi-tenant cobrindo prevencao de IDOR, integridade cross-tenant de clientes e mass-assignment.

## Non-goals
- Nao implementar automacoes ou disparo de mensagens via WhatsApp nesta fase.
- Nao implementar criacao dinamica ou builder de pipelines personalizados.
- Nao adicionar Redis, filas, IA ou processamento assincrono.
- Nao implementar integracao com agenda real ou transacoes financeiras complexas nesta etapa.