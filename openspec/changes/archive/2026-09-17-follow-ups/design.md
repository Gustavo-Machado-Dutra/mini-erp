# Design: Follow-ups Domain

## Architecture & Data Flow
1. **Acesso a Dados & Drizzle Schema:**
   - Tabela `follow_ups`:
     - `organization_id` (FK -> organizations.id CASCADE)
     - `customer_id` (FK -> customers.id SET NULL)
     - `lead_id` (FK -> leads.id SET NULL)
     - `type` (`follow_up_type`: price_follow_up, quote_follow_up, reactivation, appointment_follow_up, general)
     - `status` (`follow_up_status`: pending, completed, cancelled)
     - `channel` (`follow_up_channel`: manual, phone, email, whatsapp, other)
     - `scheduled_at` (timestamp with timezone)
     - `executed_at` (timestamp with timezone, nullable)
     - `outcome` (text, nullable)
     - `notes` (text, nullable)
   - Indices em `organization_id`, `(organization_id, status)`, `(organization_id, scheduled_at)`, `customer_id`, `lead_id`.

2. **Tenant Scoping & Security:**
   - Obrigatoriedade de `requireSession()` e `requireOrganization()`.
   - Validacao relacional no servidor: se `customerId` informado, valida que pertence a `organizationId`; se `leadId` informado, valida que pertence a `organizationId`. Se qualquer um for de outro tenant, rejeita com `400 Bad Request`.
   - Mutacao e leitura protegidas contra IDOR (`WHERE id = :id AND organization_id = :orgId`).
   - Conclusao de follow-up (`completeFollowUpAction`) grava `executed_at = new Date()` e `status = 'completed'` no servidor.

3. **Interface Web:**
   - `/follow-ups`: lista organizada por abas (Hoje, Atrasados, Proximos, Concluidos, Todos) com contadores.
   - Modal/Acao rapida para concluir com registro de desfecho (`outcome`).