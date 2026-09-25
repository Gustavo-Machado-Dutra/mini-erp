# Design: Customer Management Domain

## Architecture & Data Flow
A arquitetura segue o padrao Next.js 15 Monolith com Server Components e Server Actions:

1. **Acesso a Dados & Drizzle Schema:**
   - Tabela `customers` mapeia `id`, `organization_id` (FK -> organizations.id ON DELETE CASCADE), `name`, `email`, `phone`, `notes`, `created_at`, `updated_at`, e `created_by` (FK -> user.id ON DELETE SET NULL).
   - Indices em `organization_id` e composto em `organization_id, created_at` para consultas velozes com ordenacao temporal.

2. **Tenant Scoping & Security:**
   - Toda leitura e mutacao passa obrigatoriamente por `requireSession()` e `requireOrganization()`.
   - O servidor injeta `organizationId` e `createdBy` extraidos do contexto autorizado, rejeitando qualquer tentativa de mass-assignment via form payload.
   - Buscas por ID realizam match estrito por `id = targetId AND organization_id = activeOrgId` para neutralizar ataques de IDOR.

3. **Validacao Zod:**
   - `name`: obrigatorio, 1 a 200 caracteres, aparado (trim).
   - `email`: opcional; quando informado deve ser email valido (max 255 caracteres).
   - `phone`: opcional; string flexivel para suportar formatos nacionais e internacionais (max 50 caracteres).
   - `notes`: opcional; texto com maximo de 2000 caracteres.

4. **Server Actions:**
   - `createCustomerAction`: valida entrada, recupera contexto de sessao e tenant, insere registro no banco e executa revalidatePath.
   - `updateCustomerAction`: valida entrada, verifica pertencimento a organizacao ativa, atualiza dados e executa revalidatePath.

5. **User Interface (UI):**
   - Server Components para recuperacao de dados na renderizacao (/customers, /customers/[id], /customers/[id]/edit).
   - Client Components leves para formularios interativos com estados de loading (`isPending`) e exibicao clara de erros.
   - Tabela responsiva com adaptacao para visualizacao compacta/cards em telas moveis.