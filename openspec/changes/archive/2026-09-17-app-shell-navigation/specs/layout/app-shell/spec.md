# Spec Delta

## Purpose

Define a estrutura e o comportamento da interface principal (App Shell) do RevenueFlow para páginas autenticadas, garantindo navegação consistente, responsividade e acesso estruturado a áreas do SaaS.

## ADDED Requirements

### Requirement: Layout estrutural consistente (App Shell)

A aplicação autenticada SHALL apresentar uma estrutura de Sidebar e Header comum a todas as páginas protegidas.

#### Scenario: Estrutura inicial carregada

- **WHEN** um usuário autenticado acessa qualquer rota `/...` dentro de `(protected)`
- **THEN** a interface renderizaSidebar e Header simultaneamente com o conteúdo da página.

### Requirement: Navegação responsiva

A aplicação SHALL adaptar a exibição do App Shell de acordo com o tamanho da tela (Desktop vs Mobile).

#### Scenario: Navegador Desktop

- **WHEN** a tela é maior que `md` (tailwind breakpoint)
- **THEN** a Sidebar é visível e fixa à esquerda.

#### Scenario: Visualização Mobile

- **WHEN** a tela é menor que `md`
- **THEN** a Sidebar é recolhida ou oculta, sendo acessível via menu de ação (Sheet).

### Requirement: Indicador de rota atual

A navegação SHALL indicar qual é a rota selecionada.

#### Scenario: Estado ativo de navegação

- **WHEN** o usuário está na rota `/dashboard`
- **THEN** o link "Dashboard" na Sidebar apresenta estado visual de "ativo".