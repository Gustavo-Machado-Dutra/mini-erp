# RevenueFlow

**RevenueFlow** é um MVP de CRM comercial para empresas de serviços. O sistema organiza clientes, leads, oportunidades, agendamentos e follow-ups, além de acompanhar conversões e receita registrada ou recuperada.

O foco do produto é ajudar negócios a identificar oportunidades comerciais perdidas e acompanhar seus resultados financeiros — não apenas centralizar comunicações. O nicho inicial considerado é o de clínicas de estética, mas o domínio foi pensado para outros negócios de serviços.

> **Status:** MVP em desenvolvimento e validação local. O repositório ainda não representa, por si só, uma versão pronta para produção. Automações reais e integrações externas permanecem fora do escopo atual.

> **Nome do projeto:** o repositório se chama `mini-erp`, mas o produto e o código da aplicação usam o nome **RevenueFlow**.

## Conteúdo

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Requisitos](#requisitos)
- [Configuração local](#configuração-local)
- [Banco de dados e migrações](#banco-de-dados-e-migrações)
- [Comandos disponíveis](#comandos-disponíveis)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Segurança e isolamento por organização](#segurança-e-isolamento-por-organização)
- [Escopo atual e próximos passos](#escopo-atual-e-próximos-passos)
- [Documentação complementar](#documentação-complementar)

## Funcionalidades

O código contém páginas e módulos de domínio para os seguintes fluxos. A disponibilidade de cada fluxo depende de uma instância local corretamente configurada, com banco e migrações aplicadas.

| Módulo | O que contempla |
| --- | --- |
| **Autenticação** | Cadastro e login com e-mail e senha, usando Better Auth. |
| **Organizações** | Criação de organizações, associação do usuário como proprietário e seleção da organização ativa. |
| **Dashboard** | Indicadores de leads e conversões, taxa de conversão, follow-ups pendentes/atrasados, receita, funil comercial, atividades recentes e série mensal. |
| **Clientes** | Cadastro, consulta e edição de clientes. |
| **Leads e funil** | Registro de leads e acompanhamento por etapas comerciais. |
| **Serviços** | Cadastro e manutenção de serviços, com preço e duração. |
| **Profissionais** | Cadastro e manutenção de profissionais associados à organização. |
| **Agendamentos** | Registro de agendamentos vinculados a clientes, profissionais e serviços, com acompanhamento de status e verificação básica de conflito de horário. |
| **Follow-ups** | Registro manual de contatos de acompanhamento, com agendamento e atualização de status. |
| **Conversões** | Registro de conversões e classificação da atribuição comercial. |
| **Receita** | Registro de eventos de receita e associação opcional com conversões e agendamentos. |

### Receita registrada x receita recuperada

O dashboard diferencia **receita registrada** de **receita recuperada**. O sistema não deve atribuir automaticamente todo valor registrado a uma ação do RevenueFlow. A receita recuperada é calculada com base nos tipos de atribuição definidos no domínio, como conversão associada a follow-up ou reativação.

No MVP, essa atribuição depende dos dados registrados no sistema; ela não representa uma medição automática feita por integração com canais externos.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Aplicação web | Next.js 15, App Router, React 19 e TypeScript |
| Interface | Tailwind CSS, componentes próprios seguindo padrões do shadcn/ui/Radix UI e Lucide React |
| Autenticação e sessão | Better Auth |
| Banco de dados | PostgreSQL |
| Acesso a dados e migrações | Drizzle ORM e Drizzle Kit |
| Validação | Zod |
| Testes | Node.js Test Runner com `tsx` e Playwright para testes E2E |
| Qualidade | ESLint e TypeScript (`tsc`) |

A aplicação segue uma arquitetura de **monólito modular dentro do Next.js**. Não há um backend independente: páginas, Server Actions, consultas e regras de domínio ficam organizadas dentro da própria aplicação.

## Arquitetura

O fluxo principal de uma mutação é:

1. O servidor verifica a sessão autenticada.
2. Resolve a organização ativa e confirma que o usuário pertence a ela.
3. Valida os dados recebidos com esquemas de domínio.
4. Verifica vínculos e permissões relevantes.
5. Executa a operação no PostgreSQL por meio do Drizzle ORM.
6. Atualiza as páginas dependentes quando necessário.

Os módulos de domínio separam ações, consultas, esquemas de validação e tipos. O banco é a fonte persistente dos dados de negócio.

## Requisitos

- **Node.js 20 LTS** (recomendado pela documentação do projeto).
- npm, incluído com o Node.js.
- PostgreSQL em execução.
- Git.

## Configuração local

### 1. Clonar o repositório

```bash
git clone https://github.com/Gustavo-Machado-Dutra/mini-erp.git
cd mini-erp
```

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Criar o banco PostgreSQL

Crie um banco chamado `revenueflow`. Por exemplo, em um terminal com as ferramentas do PostgreSQL disponíveis:

```bash
createdb revenueflow
```

Também é possível criar o banco por meio do pgAdmin ou de outra ferramenta administrativa. Certifique-se de que o usuário definido na URL de conexão tenha permissão para acessar o banco e aplicar as migrações.

### 4. Configurar as variáveis de ambiente

Copie `.env.example` para `.env`.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Edite `.env` e configure as variáveis:

| Variável | Finalidade | Exemplo local |
| --- | --- | --- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL | `postgresql://postgres:SUA_SENHA@localhost:5432/revenueflow` |
| `BETTER_AUTH_SECRET` | Segredo da autenticação e das sessões | Gere um valor aleatório forte. |
| `BETTER_AUTH_URL` | URL base usada pelo Better Auth | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | URL base pública da aplicação | `http://localhost:3000` |

Gere um segredo local com Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado para `BETTER_AUTH_SECRET` no seu `.env`. Ajuste usuário, senha, host e porta de `DATABASE_URL` ao ambiente local.

**Nunca** envie ou versione um `.env` com credenciais reais. O arquivo `.env.example` deve conter apenas valores ilustrativos.

### 5. Aplicar as migrações

Com o PostgreSQL em execução e `DATABASE_URL` configurada:

```bash
npx drizzle-kit migrate
```

As migrações versionadas ficam em `src/db/migrations/`. Se a conexão com o banco falhar, a aplicação não conseguirá consultar nem persistir corretamente os dados.

### 6. Iniciar a aplicação

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Crie uma conta e, se ainda não houver uma organização associada ao usuário, conclua o fluxo de criação de organização antes de utilizar os módulos comerciais.

## Banco de dados e migrações

Os esquemas Drizzle estão em `src/db/schema/`. Entre as entidades estão organizações e associações de membros, clientes, leads, profissionais, serviços, agendamentos, follow-ups, conversões e receita, além das tabelas necessárias à autenticação.

Comandos úteis para evolução do schema:

```bash
# Gerar migrações após mudanças no schema
npx drizzle-kit generate

# Aplicar migrações pendentes
npx drizzle-kit migrate
```

Revise as migrações geradas antes de aplicá-las em qualquer ambiente que contenha dados importantes.

## Comandos disponíveis

Os scripts abaixo estão declarados no `package.json`:

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera o build da aplicação. |
| `npm run start` | Inicia a aplicação a partir do build gerado. |
| `npm run lint` | Executa o ESLint sobre `src`. |
| `npm run typecheck` | Verifica os tipos TypeScript sem gerar arquivos. |
| `npm run test` | Executa a suíte de testes configurada com o Node.js Test Runner e `tsx`. |
| `npm run test:e2e` | Executa os testes end-to-end com Playwright. |

## Testes

O repositório inclui testes de domínio e isolamento por organização, cobrindo áreas como clientes, leads, follow-ups, operações, dashboard, conversões e atribuição de receita. Também há cenários E2E para autenticação, organizações e fluxos da aplicação.

Antes de executar a suíte, confira se o banco está disponível, se as variáveis de ambiente estão configuradas e se as migrações foram aplicadas.

```bash
npm run typecheck
npm run lint
npm run test
```

Para testes E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

O Playwright está configurado para iniciar `npm run dev` na porta `3000`. Alguns cenários protegidos dependem de uma sessão e de dados válidos no banco; a presença dos testes no repositório não significa que tenham sido executados ou aprovados em toda configuração local.

## Estrutura do projeto

```text
mini-erp/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login e cadastro
│   │   ├── (protected)/         # Dashboard e áreas autenticadas
│   │   └── api/auth/            # Rotas do Better Auth
│   ├── components/
│   │   ├── layout/              # Shell, cabeçalho e navegação
│   │   └── ui/                  # Componentes de interface
│   ├── db/
│   │   ├── schema/              # Esquemas Drizzle
│   │   └── migrations/          # Migrações PostgreSQL
│   ├── lib/                     # Auth, sessão, conexão e utilitários
│   └── modules/                 # Domínios, ações, consultas e validações
├── tests/
│   ├── e2e/                     # Testes Playwright
│   └── ...                      # Testes de domínio e isolamento
├── docs/                        # Decisões arquiteturais e notas de frontend
├── openspec/                    # Especificações e mudanças de produto
├── spec.md                      # Fonte de verdade funcional/arquitetural
├── context.md                   # Memória operacional do projeto
├── drizzle.config.ts
├── playwright.config.ts
├── package.json
└── .env.example
```

## Segurança e isolamento por organização

O RevenueFlow é **multi-tenant**: cada organização representa um ambiente de negócio cujos dados devem ser isolados dos demais.

- A sessão é validada no servidor por meio do Better Auth.
- O servidor confirma o vínculo entre usuário e organização ativa.
- As ações de domínio validam entradas e limitam operações à organização autorizada.
- IDs recebidos do navegador não devem ser tratados como prova de autorização.
- `DATABASE_URL` e `BETTER_AUTH_SECRET` devem permanecer exclusivamente no ambiente server.

O isolamento da implementação atual é realizado principalmente por verificações server-side e consultas limitadas ao tenant autorizado. Não presuma que PostgreSQL Row-Level Security (RLS) esteja configurado: consulte a especificação e a implementação antes de alterar o modelo de segurança.

## Escopo atual e próximos passos

O MVP prioriza o registro manual e o acompanhamento do funil comercial, follow-ups e resultados. Os itens abaixo **não devem ser considerados funcionalidades disponíveis** apenas por constarem como possibilidades futuras na documentação:

- envio automático de mensagens e motor de automações;
- integração com WhatsApp Business, Instagram/Meta ou outros canais;
- sincronização com calendários externos;
- pagamentos, cobrança e faturamento do SaaS;
- campanhas automatizadas;
- agentes de IA ou de voz;
- filas, workers ou infraestrutura distribuída.

O objetivo desta etapa é validar os fluxos centrais do produto antes de adicionar integrações ou infraestrutura extra.

## Documentação complementar

- [`spec.md`](./spec.md) — visão do produto, escopo e regras funcionais/arquiteturais.
- [`context.md`](./context.md) — memória operacional e contexto acumulado do desenvolvimento.
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — decisões arquiteturais.
- [`docs/frontend-alignment.md`](./docs/frontend-alignment.md) — alinhamento e pendências de interface.
- [`openspec/`](./openspec/) — especificações e propostas de mudanças.

## Licença

Não foi identificado um arquivo de licença na raiz durante a revisão. Consulte o proprietário do repositório antes de reutilizar ou redistribuir o código.
