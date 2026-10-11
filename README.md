# mini-erp

## Desenvolvimento local (Windows)

Esta instalação usa um cluster PostgreSQL próprio em `.local/postgres`, na porta
5433. O serviço PostgreSQL do Windows na porta 5432 é uma instância diferente.
O comando `npm run dev` inicia apenas o Next.js; o banco também precisa estar ligado.

Na pasta do projeto, inicie o banco existente:

```powershell
& 'C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe' -D './.local/postgres' -l './.local/postgres.log' start
npm run dev
```

Acesse http://localhost:3000. Para conferir ou encerrar o banco local:

```powershell
& 'C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe' -D './.local/postgres' status
& 'C:/Program Files/PostgreSQL/18/bin/pg_ctl.exe' -D './.local/postgres' stop -m fast
```

Esses comandos pressupõem o cluster já existente nesta máquina. Não inicialize
outro cluster sobre essa pasta. As credenciais ficam no `.env`, fora do Git.
