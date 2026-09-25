# Tasks

## 1. Setup

- [ ] 1.1 Adicionar componentes necessários do shadcn/ui (`Sheet`, `Separator`, `DropdownMenu`, `Avatar`)
- [ ] 1.2 Criar estrutura de `src/components/layout/`

## 2. Componentes de UI

- [ ] 2.1 Criar `Sidebar.tsx` com navegação principal e `Pathname` ativa.
- [ ] 2.2 Criar `Header.tsx` integrando `OrgSwitcher` (refatorar org-switcher para layout) e `UserMenu`.
- [ ] 2.3 Criar `UserMenu.tsx` com dropdown (Perfil, Configurações, Sair).
- [ ] 2.4 Criar `AppShell.tsx` que compõe `Sidebar` e `Header`.

## 3. Integração de Layout

- [ ] 3.1 Atualizar `src/app/(protected)/layout.tsx` para usar `AppShell`.
- [ ] 3.2 Garantir que sub-rotas (dashboard, organizations/new) renderizem corretamente dentro do Shell.

## 4. Validação

- [ ] 4.1 Executar `npm run typecheck` e confirmar zero erros.
- [ ] 4.2 Executar `npm run lint` e confirmar zero erros.
- [ ] 4.3 Executar `npm run build` e confirmar build com sucesso.
- [ ] 4.4 Validação visual em mobile/desktop via navegador (desenvolvedor).