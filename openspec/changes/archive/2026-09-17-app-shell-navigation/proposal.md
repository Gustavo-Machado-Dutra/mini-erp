# Proposal

## Why

A aplicação possui autenticação e multi-tenancy, mas carece de uma fundação visual e estrutural (App Shell) para as páginas protegidas. Sem isso, a navegação é dificultada, a UI é inconsistente entre páginas e faltam elementos essenciais como Sidebar, Header e menus de usuário. Esta mudança cria o App Shell profissional requerido para todas as funcionalidades de domínio futuras.

## What Changes

- Implementar `AppShell` reutilizável em `src/components/layout/` contendo Sidebar, Header e contéudo principal.
- Criar navegação principal na Sidebar com estados ativos (links para: Dashboard, Leads, Clientes, etc.).
- Integrar seletor de organizações (`OrgSwitcher`) e User Menu no Header.
- Criar esquema de layout responsivo (Desktop vs Mobile/Tablet).
- Adicionar cabeçalhos de página (`PageHeader`) reutilizáveis.
- Migrar estruturação de rotas protegidas (`(protected)`) para utilizar o AppShell.

## Capabilities

### New Capabilities

- `layout/app-shell`: Aplicação autenticada apresenta interface profissional (sidebar + header), navegável, responsiva, com suporte a troca de tenant e perfil.

## Impact

- Arquivos criados: `src/components/layout/app-shell.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/layout/user-menu.tsx`.
- Arquivos modificados: `src/app/(protected)/layout.tsx` (agora um AppShell), todos as páginas de rotas protegidas (inclusão de PageHeader).
- Sem banco ou migrações.