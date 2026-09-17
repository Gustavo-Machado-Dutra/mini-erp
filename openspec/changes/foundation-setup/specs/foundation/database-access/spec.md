# Spec Delta

## Purpose

Garante que o Drizzle ORM está configurado e conectado ao PostgreSQL com um cliente type-safe disponível para uso em toda a aplicação server-side.

## ADDED Requirements

### Requirement: Cliente Drizzle disponível para uso server-side

O sistema SHALL expor um cliente Drizzle (db) configurado para PostgreSQL, acessível apenas em código server-side.

#### Scenario: Importação do cliente de banco

- **WHEN** um Server Component ou Server Action importa o cliente db de @/lib/db
- **THEN** o módulo resolve sem erros e o cliente está tipado corretamente pelo schema Drizzle

#### Scenario: Cliente não acessível no cliente browser

- **WHEN** o build é executado
- **THEN** nenhum secret de banco (DATABASE_URL, credenciais) é incluído no bundle client-side

### Requirement: Schema Drizzle definido e exportado

O sistema SHALL ter um arquivo de schema Drizzle que define as tabelas e tipos, servindo como fonte de verdade para a estrutura do banco.

#### Scenario: Schema importável e type-safe

- **WHEN** o schema é importado de @/db/schema
- **THEN** os tipos TypeScript das tabelas estão disponíveis sem erros de compilação

### Requirement: Variáveis de ambiente de banco documentadas

O sistema SHALL documentar todas as variáveis de ambiente necessárias para conexão ao banco em .env.example, sem expor valores reais.

#### Scenario: .env.example presente e completo

- **WHEN** um desenvolvedor clona o repositório
- **THEN** encontra .env.example listando DATABASE_URL e demais variáveis necessárias com descrição, sem valores de produção
