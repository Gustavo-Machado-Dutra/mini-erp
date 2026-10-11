# Melhorias da interface e pendências de alinhamento

## Escopo preservado

O redesenho mantém as rotas, Server Actions, consultas, tipos de domínio e banco.
Receita e conversões continuam usando os últimos 30 dias; o gráfico usa os últimos
seis meses. Clientes cadastrados e contatos pendentes não têm esse recorte de 30 dias.
A receita recuperada compõe a registrada e não deve ser somada a ela.

## Divergências da especificação

- `spec.md:152`, `spec.md:252` e a seção 14.2 exigem Drizzle; a seção 4.7
  (`spec.md:178`) o proíbe inicialmente. O código existente usa Drizzle com PostgreSQL.
- `spec.md:103` exige isolamento via PostgreSQL/RLS; `spec.md:344` e
  `spec.md:356` tratam RLS como opcional e descrevem um MVP sem PostgreSQL/Better Auth.
  O código existente usa PostgreSQL, Better Auth e verificações de organização.

Essas decisões precisam ser consolidadas em uma alteração de arquitetura separada.
Nenhuma regra de autorização ou isolamento foi alterada pelo redesenho.

## Graphify no Windows

CLI instalada em ambiente isolado via `uv tool install graphifyy`. Executáveis em
`C:/Users/odius/.local/bin`, adicionados ao PATH do usuário. Terminais já abertos
podem precisar ser reiniciados. Skill registrada para Codex e caminho do hook local
corrigido, preservando as instruções de `AGENTS.md`.

```powershell
graphify --help
graphify query "dashboard sidebar pipeline follow-ups customer forms"
graphify update .
```

O BOM UTF-8 de `tsconfig.json` foi removido sem mudar a configuração, permitindo
ao Graphify interpretar os aliases. Atualização e consulta posterior concluídas:
1.461 nós e 3.263 relações. Permanecem avisos sobre a codificação de `diagnose.js`
e o parser SQL opcional ausente; a atualização não fez chamadas a LLMs.

## Verificação realizada

- `npm run lint`: passou.
- `npm test`: 99 testes passaram, incluindo os modelos de domínio de isolamento
  entre organizações e atribuição de receita. Isso não substitui integração com banco.
- `npm run typecheck` e `npm run build`: bloqueados pelo import preexistente de
  `@radix-ui/react-select` em `src/components/ui/select.tsx`. Esse pacote não está
  declarado no manifesto; não foram adicionadas dependências nesta etapa.
- O PostgreSQL configurado localmente retornou `ECONNREFUSED`. A aplicação real
  abriu na tela de login, mas não foi possível validar os fluxos autenticados com banco.
- Chromium/Playwright: cópia temporária fora do repositório, sem credenciais ou banco,
  com consultas e ações simuladas exclusivamente nessa cópia. Dashboard, leads,
  follow-ups (hoje, atrasados e próximos) e cadastro de clientes foram inspecionados
  em 390, 768 e 1440 px: 18 combinações sem overflow horizontal da página.
- Menu móvel: foco contido no diálogo, Escape, retorno ao acionador e fechamento
  ao navegar. Rota `/customers/new` mantém Clientes selecionado.
- Clientes: nome obrigatório e e-mail inválido com mensagem associada e foco no
  campo; dados mantidos após falha simulada do servidor.
- Funil: lista no celular, quadro no desktop e mensagem de falha preservando o
  estágio anterior. Gráfico: barras lado a lado, zero sem altura artificial,
  escala comum e tabela de valores acessível pelo teclado.

Capturas locais e logs de inspeção estão em `test-results/` (ignorado pelo Git).
As alterações preexistentes em `package.json` e `package-lock.json` foram preservadas.
