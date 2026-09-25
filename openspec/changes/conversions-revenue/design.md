# Design: Conversions & Revenue

- Conversions: Registrar quando um lead se torna cliente (`leads` status converted) ou quando ocorre uma venda.
- Revenue: Registrar entradas financeiras (`revenue`).
- Relacionamentos:
    - Conversions -> Lead, Customer, Appointment.
    - Revenue -> Customer, Appointment.
- Tenancy estrito por `organization_id`.