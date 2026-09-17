# Tasks

## 1. Repositório Git

- [ ] 1.1 Inicializar repositório Git (git init) e verificar que .git/ foi criado em C:\Users\Pichau\Downloads\mini-erp
- [ ] 1.2 Criar .gitignore adequado para Next.js/Node e verificar que 
ode_modules, .env, .next estão listados

## 2. Aplicação Next.js

- [ ] 2.1 Criar aplicação Next.js 15 com App Router, TypeScript e Tailwind usando create-next-app e verificar que package.json e 	sconfig.json existem
- [ ] 2.2 Confirmar que 	sconfig.json tem "strict": true habilitado
- [ ] 2.3 Confirmar que a estrutura gerada usa src/app/ (App Router com srcDir)
- [ ] 2.4 Instalar e configurar shadcn/ui (
px shadcn@latest init) e verificar que src/components/ui/ existe

## 3. Dependências de Backend

- [ ] 3.1 Instalar Drizzle ORM e dependências: drizzle-orm, postgres, drizzle-kit e verificar que aparecem no package.json
- [ ] 3.2 Instalar Better Auth: etter-auth e verificar que aparece no package.json
- [ ] 3.3 Confirmar que Zod está disponível (shadcn/ui ou react-hook-form geralmente o instala; instalar explicitamente se ausente)

## 4. Estrutura de Diretórios

- [ ] 4.1 Criar src/lib/ e verificar que o diretório existe
- [ ] 4.2 Criar src/db/schema/ e verificar que o diretório existe
- [ ] 4.3 Criar src/db/migrations/ e verificar que o diretório existe
- [ ] 4.4 Criar src/modules/ e verificar que o diretório existe
- [ ] 4.5 Criar docs/ e verificar que o diretório existe

## 5. Configuração do Banco (Drizzle)

- [ ] 5.1 Criar src/lib/db.ts com o cliente Drizzle apontando para DATABASE_URL; verificar que o arquivo compila sem erros (
pm run typecheck)
- [ ] 5.2 Criar src/db/schema/index.ts com export vazio (schema será populado nas fases seguintes); verificar que o arquivo importa sem erros
- [ ] 5.3 Criar drizzle.config.ts na raiz do projeto com configuração do drizzle-kit; verificar que o arquivo compila sem erros

## 6. Configuração do Better Auth

- [ ] 6.1 Criar src/lib/auth.ts com instância Better Auth usando variáveis de ambiente; verificar que o arquivo compila sem erros (
pm run typecheck)
- [ ] 6.2 Criar src/app/api/auth/[...all]/route.ts como route handler do Better Auth; verificar que o arquivo existe e compila

## 7. Variáveis de Ambiente

- [ ] 7.1 Criar .env.example documentando: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL com descrições de como obtê-los; verificar que o arquivo existe e contém as três variáveis
- [ ] 7.2 Criar .env local com valores placeholder para desenvolvimento (não commitar — já estará no .gitignore)

## 8. Documentação

- [ ] 8.1 Criar docs/DECISIONS.md com a decisão arquitetural da fundação (problema, alternativas, decisão, motivo, consequências) e verificar que o arquivo existe

## 9. Validação

- [ ] 9.1 Executar 
pm run typecheck (ou 
px tsc --noEmit) e verificar saída sem erros
- [ ] 9.2 Executar 
pm run lint e verificar saída sem erros
- [ ] 9.3 Executar 
pm run build e verificar build completo sem erros

## 10. Commit Inicial

- [ ] 10.1 Fazer git add . e verificar arquivos staged
- [ ] 10.2 Commit: eat: initialize RevenueFlow foundation e verificar que git log mostra o commit
