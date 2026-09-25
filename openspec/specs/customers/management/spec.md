# Spec: Customer Management

## Purpose
Prover o gerenciamento completo do cadastro de clientes do negocio, permitindo criacao, visualizacao, listagem com busca e edicao com estrito isolamento por organizacao (multi-tenancy).

## Requirements

### Data Model
- Entidade `customers` contem: `id`, `organization_id` (obrigatorio, FK -> organizations.id), `name` (obrigatorio), `email` (opcional), `phone` (opcional), `notes` (opcional), `created_at`, `updated_at`, `created_by` (FK -> user.id).
- Indices em `organization_id` e `(organization_id, created_at)`.

### Multi-Tenancy & Authorization
- Toda consulta de clientes DEVE filtrar por `organization_id = activeOrganizationId`.
- Toda mutacao (create/update) DEVE verificar sessao ativa e membership na organizacao.
- Tentativas de ler ou editar clientes de outra organizacao retornam 404/403 (IDOR Prevention).
- O identificador do criador (`created_by`) e atribuido estritamente a partir da sessao ativa do servidor.

### User Experience
- Rota `/customers`: lista clientes com busca textual rapida por nome, email ou telefone.
- Rota `/customers/new`: formulario acessivel para cadastrar novo cliente.
- Rota `/customers/[id]`: exibe informacoes detalhadas do cliente e links de navegacao.
- Rota `/customers/[id]/edit`: formulario para edicao dos dados cadastrais.
- Feedback visual de carregamento (`isPending`) e mensagens amigaveis de erro sem expor detalhes internos de infraestrutura.