# Proposal: Customer Management Domain

## Why
A Fase 4 concluiu a fundacao visual com AppShell, Sidebar e Header responsivos. Agora, o RevenueFlow necessita da implementacao de seu primeiro dominio de negocio real: Gerenciamento de Clientes (Customer Management). Clientes sao a entidade base para os modulos subsequentes de Leads, Oportunidades, Agendamentos, Follow-ups e Receita.

## What Changes
- Definir a tabela Drizzle `customers` com isolamento multi-tenant por `organization_id`, chaves estrangeiras, indices e campos essenciais (nome, email, telefone, notas, created_by, timestamps).
- Implementar schemas de validacao Zod e tipagem TypeScript para criacao e edicao de clientes.
- Desenvolver funcoes de consulta server-side escopadas estritamente por organizacao ativa (prevenindo vazamento cross-tenant e IDOR).
- Criar Server Actions para mutacoes de negocio (criacao e edicao de clientes) com resolucao de tenancy e sessao no servidor.
- Construir a interface web App Router:
  - Listagem de clientes com busca basica (nome, email, telefone) e empty state amigavel;
  - Formulario de criacao de cliente;
  - Pagina de detalhes do cliente;
  - Formulario de edicao do cliente;
  - Tratamento de estados de loading, feedback e erros.
- Criar suite de testes automatizados de dominio e isolamento multi-tenant cobrindo prevencao de IDOR, mass assignment e autorizacao.

## Non-goals
- Nao implementar exclusao fisica/logica de clientes na Fase 5 (clientes sao entidades centrais do historico de oportunidades e receita; ver ADR-007).
- Nao criar microservicos, filas, Redis, CQRS ou APIs REST desnecessarias.
- Nao adicionar campos especificos de nicho (ex: prontuario, clinica, CRM medico).
- Nao implementar gestao avancada de tags, enderecos complexos ou multiplos contatos nesta fase.