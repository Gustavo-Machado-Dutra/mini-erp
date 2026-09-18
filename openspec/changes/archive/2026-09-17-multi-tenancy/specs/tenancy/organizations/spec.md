# Spec Delta

## Purpose

Define o comportamento de multi-tenancy do RevenueFlow: criacao de organizacoes, vinculo de membros com papeis hierarquicos, resolucao de tenant context e isolamento estrito entre organizacoes.

## ADDED Requirements

### Requirement: Criacao de Organizacao Transacional

O sistema SHALL permitir que um usuario autenticado crie uma organizacao, tornando-o automaticamente membro com papel `owner`.

#### Scenario: Criacao bem sucedida

- **WHEN** um usuario autenticado submete nome e slug para uma nova organizacao
- **THEN** o sistema cria a organizacao no banco, cria o registro em `organization_members` associando o usuario com role `owner` e define a organizacao como ativa.

#### Scenario: Tentativa de criacao por usuario nao autenticado

- **WHEN** uma requisicao anonima tenta criar uma organizacao
- **THEN** o sistema rejeita com erro de autenticacao (401/Unauthorized).

### Requirement: Isolamento e Validacao de Membership

O sistema SHALL exigir e validar server-side que o usuario autenticado e membro da organizacao solicitada antes de permitir qualquer operacao sobre dados daquele tenant.

#### Scenario: Acesso permitido a membro da organizacao

- **WHEN** o usuario A acessa dados da Organizacao A da qual e membro
- **THEN** o sistema autoriza e retorna os dados escopados para a Organizacao A.

#### Scenario: Acesso negado a organizacao de terceiros (IDOR Prevention)

- **WHEN** o usuario A tenta acessar ou manipular dados da Organizacao B enviando o `organization_id` de B
- **THEN** o sistema verifica a tabela `organization_members`, constata a ausencia de membership e rejeita a requisicao com erro de permissao (403/Forbidden).

### Requirement: Autorizacao Baseada em Papeis (Roles)

O sistema SHALL restringir acoes administrativas ou criticas aos papeis autorizados (`owner`, `admin`, `member`).

#### Scenario: Acao exclusiva de owner executada por member

- **WHEN** um usuario com papel `member` tenta executar uma acao que requer papel `owner` ou `admin`
- **THEN** o sistema rejeita a operacao com erro de permissao (403/Forbidden).

### Requirement: Tenant Context Server-Side

O sistema SHALL derivar a organizacao ativa no servidor a partir da sessao e da verificacao de membership, sem confiar cegamente em identificadores fornecidos pelo cliente.

#### Scenario: Resolucao de organizacao ativa

- **WHEN** o servidor processa uma acao ou renderiza uma pagina protegida
- **THEN** o helper `requireOrganization` valida a sessao, busca o membership correspondente e disponibiliza o contexto `{ organization, membership, user }`.