# Design: E2E Testing

- Framework: Playwright (TypeScript).
- Estrutura: `tests/e2e/`.
- Dados: Isolados e criados no cleanup do teste (ou utilizando fixtures).
- Escopo: Fluxos críticos (Auth -> Tenancy -> Funcionalidades).
- Isolamento: Testar explicitamente a segregação entre Tenants A e B.