# Design

## Context

Fase 4 foca na fundação visual. A estrutura de roteamento (App Router) e as rotas protegidas já existem (`(protected)` layout). Precisamos substituir o layout básico por um App Shell com Sidebar, Header responsivo e navegação ativa.

## Goals / Non-Goals

**Goals:**
- AppShell (`src/components/layout/app-shell.tsx`) envoltório.
- Sidebar componente (`Sidebar`, `SidebarItem`).
- Header componente (`Header`, `OrgSwitcher`, `UserMenu`).
- Integração da navegação ativa via `usePathname()`.
- Responsividade total com shadcn/ui `Sheet`.
- Placeholder de páginas funcionais.

**Non-Goals:**
- Implementação de funcionalidades nas rotas placeholders.
- Estilização customizada agressiva (shadcn/ui default + Tailwind básico).
- Animações complexas.

## Decisions

### AppShell como Server Component Wrapper

**Escolha:** `AppShell` é um Server Component que recebe `children` e compõe Layouts de Sidebar/Header usando Client Components pontuais (`SidebarSwitcher`, `UserMenu`, `ResponsiveMobileNav`).
**Razão:** Máxima performance e SEO com prerendering do esqueleto visual.

### Responsividade via shadcn/ui `Sheet`

**Escolha:** Usar componente `Sheet` do shadcn para o menu mobile.
**Razão:** Componente padrão, acessível e otimizado para esse padrao de UI.

## Risks / Trade-offs

- **Complexidade de layout:** Manter header e sidebar fixos pode criar conflitos de scroll se não gerenciado adequadamente com Tailwind (flex/grid).
- **Client components espalhados:** Evitar transformar Sidebar inteira em `use client` — usar `use client` apenas nas interações (Menu mobile button, UserMenu dropdown, OrgSwitcher interaction).