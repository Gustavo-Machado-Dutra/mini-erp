# Tasks

## 1. Correcoes da Fase 1

- [ ] 1.1 Corrigir package.json: adicionar zod e typescript nas dependencias corretas; remover trailing commas; verificar que `npm install` funciona sem erros

## 2. Schema do Banco

- [ ] 2.1 Criar src/db/schema/auth.ts com tabelas Better Auth (user, session, account, verification) usando pgTable do Drizzle; verificar que tsc --noEmit compila sem erros
- [ ] 2.2 Atualizar src/db/schema/index.ts para exportar tudo de auth.ts; verificar import funcional

## 3. Better Auth Config

- [ ] 3.1 Atualizar src/lib/auth.ts para importar o schema de auth e usar usePlural:false; verificar compilacao
- [ ] 3.2 Criar src/lib/auth-client.ts com createAuthClient do better-auth/react para uso no browser; verificar compilacao

## 4. Sessao Server-Side

- [ ] 4.1 Criar src/lib/auth-session.ts com funcao getSession que obtem a sessao a partir dos headers/cookies do request; verificar compilacao

## 5. Middleware

- [ ] 5.1 Criar src/middleware.ts com protecao de rotas — redirecionar para /login se cookie de sessao ausente em rotas protegidas; verificar compilacao

## 6. Paginas de Auth

- [ ] 6.1 Criar src/app/(auth)/layout.tsx com layout minimo para paginas publicas; verificar compilacao
- [ ] 6.2 Criar src/app/(auth)/register/page.tsx com formulario de cadastro (nome, email, senha) com validacao Zod; verificar compilacao
- [ ] 6.3 Criar src/app/(auth)/login/page.tsx com formulario de login (email, senha) com validacao Zod; verificar compilacao

## 7. Pagina Protegida

- [ ] 7.1 Criar src/app/(protected)/layout.tsx com layout para rotas autenticadas; verificar compilacao
- [ ] 7.2 Criar src/app/(protected)/dashboard/page.tsx como pagina minima que mostra o email do usuario logado e botao de logout; verificar compilacao

## 8. Documentacao

- [ ] 8.1 Adicionar ADR-005 em docs/DECISIONS.md: decisao de nao usar Organizations plugin do Better Auth na Fase 2
- [ ] 8.2 Atualizar .env.example com instrucoes claras sobre PostgreSQL necessario

## 9. Validacao

- [ ] 9.1 Executar npm run typecheck e confirmar zero erros
- [ ] 9.2 Executar npm run lint e confirmar zero erros
- [ ] 9.3 Executar npm run build e confirmar build completo