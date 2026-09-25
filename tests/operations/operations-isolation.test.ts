import assert from 'node:assert/strict'
import test from 'node:test'
import { createServiceSchema, updateServiceSchema } from '../../src/modules/services/schemas'
import { createProfessionalSchema, updateProfessionalSchema } from '../../src/modules/professionals/schemas'
import { createAppointmentSchema, updateAppointmentSchema, updateAppointmentStatusSchema } from '../../src/modules/appointments/schemas'
import type { Service } from '../../src/db/schema/services'
import type { Professional } from '../../src/db/schema/professionals'
import type { Appointment, AppointmentStatus } from '../../src/db/schema/appointments'
import type { Customer } from '../../src/db/schema/customers'

interface MockUser {
  id: string
  name: string
  email: string
}

interface MockOrganization {
  id: string
  name: string
  slug: string
}

interface MockMembership {
  id: string
  organizationId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
}

class OperationsDomainEngine {
  private organizations = new Map<string, MockOrganization>()
  private memberships: MockMembership[] = []
  private customers: Customer[] = []
  private services: Service[] = []
  private professionals: Professional[] = []
  private appointments: Appointment[] = []

  createOrg(user: MockUser, name: string, slug: string): MockOrganization {
    const org: MockOrganization = { id: `org_${Date.now()}_${Math.random()}`, name, slug }
    this.organizations.set(org.id, org)
    this.memberships.push({
      id: `mem_${Date.now()}_${Math.random()}`,
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    })
    return org
  }

  createCustomer(orgId: string, name: string): Customer {
    const cust: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: orgId,
      name,
      email: null,
      phone: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'sys',
    }
    this.customers.push(cust)
    return cust
  }

  requireOrganization(
    sessionUser: MockUser | null,
    orgId: string
  ): { org: MockOrganization; user: MockUser } {
    if (!sessionUser) {
      throw new Error('401: Unauthorized - Requer sessão ativa')
    }
    const org = this.organizations.get(orgId)
    if (!org) {
      throw new Error('404: Organização não encontrada')
    }
    const membership = this.memberships.find(
      (m) => m.organizationId === orgId && m.userId === sessionUser.id
    )
    if (!membership) {
      throw new Error('403: Forbidden - Usuário não pertence a esta organização')
    }
    return { org, user: sessionUser }
  }

  // --- Services ---
  createService(sessionUser: MockUser | null, orgId: string, rawInput: unknown): Service {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createServiceSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const now = new Date()
    const s: Service = {
      id: `serv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id,
      createdBy: user.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      durationMinutes: parsed.data.durationMinutes,
      price: parsed.data.price,
      active: parsed.data.active ?? true,
      createdAt: now,
      updatedAt: now,
    }
    this.services.push(s)
    return s
  }

  // --- Professionals ---
  createProfessional(sessionUser: MockUser | null, orgId: string, rawInput: unknown): Professional {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createProfessionalSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    const now = new Date()
    const p: Professional = {
      id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id,
      userId: null,
      createdBy: user.id,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      active: parsed.data.active ?? true,
      createdAt: now,
      updatedAt: now,
    }
    this.professionals.push(p)
    return p
  }

  // --- Services (read/update/toggle) ---
  getServiceById(sessionUser: MockUser | null, orgId: string, serviceId: string): Service | null {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const found = this.services.find((s) => s.id === serviceId && s.organizationId === org.id)
    return found ?? null
  }

  updateService(sessionUser: MockUser | null, orgId: string, rawInput: unknown): Service {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = updateServiceSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }
    const index = this.services.findIndex(
      (s) => s.id === parsed.data.id && s.organizationId === org.id
    )
    if (index === -1) {
      throw new Error('404: Serviço não encontrado nesta organização')
    }
    const updated: Service = {
      ...this.services[index],
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      durationMinutes: parsed.data.durationMinutes,
      price: parsed.data.price,
      active: parsed.data.active,
      updatedAt: new Date(),
    }
    this.services[index] = updated
    return updated
  }

  toggleServiceActive(
    sessionUser: MockUser | null,
    orgId: string,
    serviceId: string,
    active: boolean
  ): Service {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const index = this.services.findIndex(
      (s) => s.id === serviceId && s.organizationId === org.id
    )
    if (index === -1) {
      throw new Error('404: Serviço não encontrado nesta organização')
    }
    const updated: Service = { ...this.services[index], active, updatedAt: new Date() }
    this.services[index] = updated
    return updated
  }

  // --- Professionals (read/update/toggle) ---
  getProfessionalById(
    sessionUser: MockUser | null,
    orgId: string,
    professionalId: string
  ): Professional | null {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const found = this.professionals.find(
      (p) => p.id === professionalId && p.organizationId === org.id
    )
    return found ?? null
  }

  updateProfessional(sessionUser: MockUser | null, orgId: string, rawInput: unknown): Professional {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = updateProfessionalSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }
    const index = this.professionals.findIndex(
      (p) => p.id === parsed.data.id && p.organizationId === org.id
    )
    if (index === -1) {
      throw new Error('404: Profissional não encontrado nesta organização')
    }
    const updated: Professional = {
      ...this.professionals[index],
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      active: parsed.data.active,
      updatedAt: new Date(),
    }
    this.professionals[index] = updated
    return updated
  }

  toggleProfessionalActive(
    sessionUser: MockUser | null,
    orgId: string,
    professionalId: string,
    active: boolean
  ): Professional {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const index = this.professionals.findIndex(
      (p) => p.id === professionalId && p.organizationId === org.id
    )
    if (index === -1) {
      throw new Error('404: Profissional não encontrado nesta organização')
    }
    const updated: Professional = { ...this.professionals[index], active, updatedAt: new Date() }
    this.professionals[index] = updated
    return updated
  }

  // --- Appointments ---
  createAppointment(sessionUser: MockUser | null, orgId: string, rawInput: unknown): Appointment {
    const { org, user } = this.requireOrganization(sessionUser, orgId)
    const parsed = createAppointmentSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error(`400: Validation Error - ${parsed.error.issues[0]?.message}`)
    }

    // Validar que Customer pertence à mesma org
    const cust = this.customers.find(
      (c) => c.id === parsed.data.customerId && c.organizationId === org.id
    )
    if (!cust) throw new Error('400: Customer não pertence à organização')

    // Validar que Professional pertence à mesma org
    const prof = this.professionals.find(
      (p) => p.id === parsed.data.professionalId && p.organizationId === org.id
    )
    if (!prof) throw new Error('400: Professional não pertence à organização')

    // Validar que Service pertence à mesma org
    const serv = this.services.find(
      (s) => s.id === parsed.data.serviceId && s.organizationId === org.id
    )
    if (!serv) throw new Error('400: Service não pertence à organização')

    // Conflito de agenda do profissional no mesmo horário
    const conflict = this.appointments.find(
      (a) =>
        a.organizationId === org.id &&
        a.professionalId === parsed.data.professionalId &&
        a.scheduledAt.getTime() === parsed.data.scheduledAt.getTime() &&
        a.status !== 'cancelled'
    )
    if (conflict) {
      throw new Error('409: Conflito de horário para este profissional')
    }

    const now = new Date()
    const appt: Appointment = {
      id: `appt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      organizationId: org.id,
      createdBy: user.id,
      customerId: parsed.data.customerId,
      professionalId: parsed.data.professionalId,
      serviceId: parsed.data.serviceId,
      scheduledAt: parsed.data.scheduledAt,
      status: parsed.data.status ?? 'scheduled',
      notes: parsed.data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }
    this.appointments.push(appt)
    return appt
  }

  getAppointmentById(sessionUser: MockUser | null, orgId: string, apptId: string): Appointment | null {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const found = this.appointments.find((a) => a.id === apptId && a.organizationId === org.id)
    return found ?? null
  }

  updateAppointmentStatus(
    sessionUser: MockUser | null,
    orgId: string,
    rawInput: unknown
  ): Appointment {
    const { org } = this.requireOrganization(sessionUser, orgId)
    const parsed = updateAppointmentStatusSchema.safeParse(rawInput)
    if (!parsed.success) {
      throw new Error('400: Status inválido')
    }

    const index = this.appointments.findIndex(
      (a) => a.id === parsed.data.id && a.organizationId === org.id
    )
    if (index === -1) {
      throw new Error('404: Agendamento não encontrado nesta organização')
    }

    const updated: Appointment = {
      ...this.appointments[index],
      status: parsed.data.status,
      updatedAt: new Date(),
    }
    this.appointments[index] = updated
    return updated
  }
}

test('Operations Domain Multi-Tenant Security & Isolation Suite', async (t) => {
  const engine = new OperationsDomainEngine()

  const userA: MockUser = { id: 'usr_a', name: 'Alice', email: 'alice@a.com' }
  const userB: MockUser = { id: 'usr_b', name: 'Bob', email: 'bob@b.com' }

  const orgA = engine.createOrg(userA, 'Clínica A', 'clinica-a')
  const orgB = engine.createOrg(userB, 'Clínica B', 'clinica-b')

  const customerA = engine.createCustomer(orgA.id, 'Cliente A')
  const customerB = engine.createCustomer(orgB.id, 'Cliente B')

  let serviceA: Service
  let serviceB: Service
  let profA: Professional
  let profB: Professional
  let apptA: Appointment

  await t.test('1. Services: Criação e validação de serviço em Org A e Org B', () => {
    serviceA = engine.createService(userA, orgA.id, {
      name: 'Limpeza de Pele',
      durationMinutes: 60,
      price: 150.0,
    })
    assert.equal(serviceA.organizationId, orgA.id)
    assert.equal(serviceA.price, '150.00')
    assert.equal(serviceA.durationMinutes, 60)

    serviceB = engine.createService(userB, orgB.id, {
      name: 'Harmonização',
      durationMinutes: 90,
      price: 800.0,
    })
    assert.equal(serviceB.organizationId, orgB.id)
  })

  await t.test('2. Professionals: Criação e validação de profissionais em Org A e Org B', () => {
    profA = engine.createProfessional(userA, orgA.id, {
      name: 'Dra. Camila A',
      email: 'camila@a.com',
      phone: '11999991111',
    })
    assert.equal(profA.organizationId, orgA.id)

    profB = engine.createProfessional(userB, orgB.id, {
      name: 'Dr. Felipe B',
      email: 'felipe@b.com',
      phone: '21988882222',
    })
    assert.equal(profB.organizationId, orgB.id)
  })

  await t.test('3. Appointments: Criação bem-sucedida de agendamento em Org A', () => {
    const scheduledDate = new Date('2026-10-15T14:00:00Z')
    apptA = engine.createAppointment(userA, orgA.id, {
      customerId: customerA.id,
      professionalId: profA.id,
      serviceId: serviceA.id,
      scheduledAt: scheduledDate,
      status: 'scheduled',
      notes: 'Primeira sessão',
    })

    assert.equal(apptA.organizationId, orgA.id)
    assert.equal(apptA.customerId, customerA.id)
    assert.equal(apptA.professionalId, profA.id)
    assert.equal(apptA.serviceId, serviceA.id)
    assert.equal(apptA.status, 'scheduled')
  })

  await t.test('4. Cross-Tenant Protection: Org A tenta criar agendamento usando Customer B de Org B (DENIED)', () => {
    assert.throws(
      () =>
        engine.createAppointment(userA, orgA.id, {
          customerId: customerB.id,
          professionalId: profA.id,
          serviceId: serviceA.id,
          scheduledAt: new Date('2026-10-15T16:00:00Z'),
        }),
      /Customer não pertence/
    )
  })

  await t.test('5. Cross-Tenant Protection: Org A tenta criar agendamento usando Professional B de Org B (DENIED)', () => {
    assert.throws(
      () =>
        engine.createAppointment(userA, orgA.id, {
          customerId: customerA.id,
          professionalId: profB.id,
          serviceId: serviceA.id,
          scheduledAt: new Date('2026-10-15T16:00:00Z'),
        }),
      /Professional não pertence/
    )
  })

  await t.test('6. Cross-Tenant Protection: Org A tenta criar agendamento usando Service B de Org B (DENIED)', () => {
    assert.throws(
      () =>
        engine.createAppointment(userA, orgA.id, {
          customerId: customerA.id,
          professionalId: profA.id,
          serviceId: serviceB.id,
          scheduledAt: new Date('2026-10-15T16:00:00Z'),
        }),
      /Service não pertence/
    )
  })

  await t.test('7. Conflict Protection: Tentativa de agendamento no mesmo horário para o mesmo profissional (409 Conflict)', () => {
    assert.throws(
      () =>
        engine.createAppointment(userA, orgA.id, {
          customerId: customerA.id,
          professionalId: profA.id,
          serviceId: serviceA.id,
          scheduledAt: new Date('2026-10-15T14:00:00Z'), // Mesmo horário exato
        }),
      /409: Conflito de horário/
    )
  })

  await t.test('8. Status Transition: Atualização de status para confirmed e completed', () => {
    const updated = engine.updateAppointmentStatus(userA, orgA.id, {
      id: apptA.id,
      status: 'confirmed',
    })
    assert.equal(updated.status, 'confirmed')

    const completed = engine.updateAppointmentStatus(userA, orgA.id, {
      id: apptA.id,
      status: 'completed',
    })
    assert.equal(completed.status, 'completed')
  })

  await t.test('9. Cross-Tenant IDOR: Usuário A tenta ler agendamento de Org B ou vice-versa (DENIED/404)', () => {
    const readAttempt = engine.getAppointmentById(userB, orgB.id, apptA.id)
    assert.equal(readAttempt, null)

    assert.throws(
      () =>
        engine.updateAppointmentStatus(userB, orgB.id, {
          id: apptA.id,
          status: 'cancelled',
        }),
      /404: Agendamento não encontrado/
    )
  })

  await t.test('10. Unauthenticated: Acesso sem sessão é bloqueado (401)', () => {
    assert.throws(
      () =>
        engine.createAppointment(null, orgA.id, {
          customerId: customerA.id,
          professionalId: profA.id,
          serviceId: serviceA.id,
          scheduledAt: new Date(),
        }),
      /401: Unauthorized/
    )
  })
  await t.test('11. Cross-Tenant IDOR Update: Usuario A tenta atualizar serviço de Org B (DENIED/404)', () => {
    assert.throws(
      () =>
        engine.updateService(userA, orgA.id, {
          id: serviceB.id,
          name: 'Renomeado por A',
          durationMinutes: 60,
          price: 999.0,
        }),
      /404: Serviço não encontrado/
    )
    const untouched = engine.getServiceById(userB, orgB.id, serviceB.id)
    assert.ok(untouched, 'serviço de B deve existir para B')
    assert.equal(untouched.name, 'Harmonização')
  })

  await t.test('12. Cross-Tenant IDOR Toggle: Usuario A tenta ativar/desativar serviço de Org B (DENIED/404)', () => {
    assert.throws(
      () => engine.toggleServiceActive(userA, orgA.id, serviceB.id, false),
      /404: Serviço não encontrado/
    )
  })

  await t.test('13. Cross-Tenant IDOR Update: Usuario A tenta atualizar profissional de Org B (DENIED/404)', () => {
    assert.throws(
      () =>
        engine.updateProfessional(userA, orgA.id, {
          id: profB.id,
          name: 'Alterado por A',
          email: 'hack@a.com',
        }),
      /404: Profissional não encontrado/
    )
    const untouched = engine.getProfessionalById(userB, orgB.id, profB.id)
    assert.ok(untouched, 'profissional de B deve existir para B')
    assert.equal(untouched.name, 'Dr. Felipe B')
  })

  await t.test('14. Cross-Tenant IDOR Toggle: Usuario A tenta ativar/desativar profissional de Org B (DENIED/404)', () => {
    assert.throws(
      () => engine.toggleProfessionalActive(userA, orgA.id, profB.id, false),
      /404: Profissional não encontrado/
    )
  })

  await t.test('15. Mass Assignment: organization_id/created_by injetados são ignorados (Services/Professionals/Appointments)', () => {
    const serviceInjected = engine.createService(userA, orgA.id, {
      name: 'Serviço Injeção',
      durationMinutes: 30,
      price: 100,
      organizationId: orgB.id,
      createdBy: userB.id,
    })
    assert.equal(serviceInjected.organizationId, orgA.id)
    assert.equal(serviceInjected.createdBy, userA.id)
    assert.notEqual(serviceInjected.organizationId, orgB.id)

    const profInjected = engine.createProfessional(userA, orgA.id, {
      name: 'Prof Injeção',
      organizationId: orgB.id,
      createdBy: userB.id,
    })
    assert.equal(profInjected.organizationId, orgA.id)
    assert.equal(profInjected.createdBy, userA.id)
    assert.notEqual(profInjected.organizationId, orgB.id)

    const apptInjected = engine.createAppointment(userA, orgA.id, {
      customerId: customerA.id,
      professionalId: profA.id,
      serviceId: serviceA.id,
      scheduledAt: new Date('2026-11-01T10:00:00Z'),
      organizationId: orgB.id,
      createdBy: userB.id,
    })
    assert.equal(apptInjected.organizationId, orgA.id)
    assert.equal(apptInjected.createdBy, userA.id)
    assert.notEqual(apptInjected.organizationId, orgB.id)
  })
})