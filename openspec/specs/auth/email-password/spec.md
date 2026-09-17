# auth/email-password Specification

## Purpose
Permite que usuarios se cadastrem e autentiquem com email e senha, mantendo sessao segura gerenciada por cookie httpOnly no servidor.

## Requirements

### Requirement: Cadastro com email e senha

O sistema SHALL permitir que um novo usuario se cadastre informando nome, email e senha.

#### Scenario: Cadastro valido

- **WHEN** um usuario submete o formulario de cadastro com nome, email valido e senha com minimo 8 caracteres
- **THEN** o sistema cria o usuario no banco e redireciona para /dashboard

#### Scenario: Email duplicado

- **WHEN** um usuario tenta se cadastrar com um email ja existente
- **THEN** o sistema exibe mensagem de erro e nao cria o usuario

#### Scenario: Dados invalidos

- **WHEN** um usuario submete o formulario com email invalido ou senha menor que 8 caracteres
- **THEN** o sistema exibe erros de validacao nos campos correspondentes

### Requirement: Login com email e senha

O sistema SHALL permitir que um usuario existente faca login com email e senha.

#### Scenario: Login valido

- **WHEN** um usuario submete email e senha corretos
- **THEN** o sistema cria a sessao e redireciona para /dashboard

#### Scenario: Credenciais invalidas

- **WHEN** um usuario submete email ou senha incorretos
- **THEN** o sistema exibe mensagem de erro generica sem revelar qual credencial esta incorreta

### Requirement: Logout

O sistema SHALL permitir que um usuario autenticado faca logout.

#### Scenario: Logout com sucesso

- **WHEN** um usuario autenticado clica em sair
- **THEN** a sessao e destruida e o usuario e redirecionado para /login

### Requirement: Sessao segura

O sistema SHALL manter a sessao do usuario usando cookie httpOnly gerenciado pelo Better Auth.

#### Scenario: Sessao valida no servidor

- **WHEN** um Server Component ou Server Action precisa da identidade do usuario
- **THEN** o sistema obtem a sessao a partir dos cookies do request sem depender de dados enviados pelo browser

#### Scenario: Sessao expirada ou inexistente

- **WHEN** um usuario tenta acessar uma rota protegida sem sessao valida
- **THEN** o sistema redireciona para /login

### Requirement: Protecao de rotas

O sistema SHALL proteger rotas que exigem autenticacao, impedindo acesso sem sessao valida.

#### Scenario: Acesso autenticado a rota protegida

- **WHEN** um usuario com sessao valida acessa /dashboard
- **THEN** a pagina e renderizada normalmente

#### Scenario: Acesso nao autenticado a rota protegida

- **WHEN** um usuario sem sessao acessa /dashboard
- **THEN** o sistema redireciona para /login
