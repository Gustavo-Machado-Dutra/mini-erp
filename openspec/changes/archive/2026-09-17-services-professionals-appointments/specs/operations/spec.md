# Spec: Services, Professionals & Appointments Operations

## Purpose
Prover a gestao de servicos comercializados, quadro de profissionais e agendamentos operacionais, garantindo integridade relacional estrita dentro de cada organizacao.

## Requirements
- `services`: cadastro com duracao em minutos, preco decimal e status ativo/inativo.
- `professionals`: cadastro com dados de contato e status ativo/inativo.
- `appointments`: agendamento vinculando cliente, profissional, servico, data/hora e status.
- Isolamento multi-tenant rigoroso e bloqueio de utilizacao de servicos, profissionais ou clientes de outras organizacoes.
- Agenda com separacao de agendamentos de Hoje, Proximos, Atrasados e Historico.