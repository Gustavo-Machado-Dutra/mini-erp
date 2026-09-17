# Spec Delta

## Purpose

Garante que o Better Auth está instalado e configurado no servidor, com a instância pronta para receber providers e integração com o banco de dados PostgreSQL via Drizzle.

## ADDED Requirements

### Requirement: Instância Better Auth configurada no servidor

O sistema SHALL ter uma instância Better Auth configurada em src/lib/auth.ts, usando as variáveis de ambiente obrigatórias e o cliente de banco Drizzle.

#### Scenario: Módulo de auth importável sem erros

- **WHEN** o arquivo src/lib/auth.ts é importado em contexto server-side
- **THEN** a instância Better Auth resolve sem erros de TypeScript ou de runtime

#### Scenario: Secrets de auth não expostos ao cliente

- **WHEN** o build é executado
- **THEN** BETTER_AUTH_SECRET e DATABASE_URL não aparecem no bundle client-side

### Requirement: Variáveis de ambiente de auth documentadas

O sistema SHALL documentar BETTER_AUTH_SECRET e BETTER_AUTH_URL no .env.example, sem valores reais.

#### Scenario: .env.example documenta todas as variáveis de auth

- **WHEN** um desenvolvedor lê .env.example
- **THEN** encontra BETTER_AUTH_SECRET e BETTER_AUTH_URL com descrição clara de como obtê-los
