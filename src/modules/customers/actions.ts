'use server'

import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { customers } from '@/db/schema/customers'
import {
  requireSession,
  requireOrganization,
  AuthError,
  ForbiddenError,
} from '@/modules/tenancy/context'
import {
  createCustomerSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from './schemas'
import type { ActionResult, Customer } from './types'

/**
 * Cria um novo cliente associado à organização ativa e ao usuário logado.
 * Protegido contra mass-assignment de organization_id e created_by.
 */
export async function createCustomerAction(
  rawInput: CreateCustomerInput
): Promise<ActionResult<Customer>> {
  try {
    const session = await requireSession()
    const activeContext = await requireOrganization()

    const parsed = createCustomerSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos'
      return {
        success: false,
        error: firstError,
        statusCode: 400,
      }
    }

    const { name, email, phone, notes } = parsed.data

    const [newCustomer] = await db
      .insert(customers)
      .values({
        organizationId: activeContext.organization.id,
        createdBy: session.user.id,
        name,
        email,
        phone,
        notes,
      })
      .returning()

    revalidatePath('/customers')
    return {
      success: true,
      data: newCustomer,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao criar cliente' }
  }
}

/**
 * Atualiza um cliente existente pertencente à organização ativa.
 * Previne IDOR verificando customer.id AND customer.organizationId.
 */
export async function updateCustomerAction(
  rawInput: UpdateCustomerInput
): Promise<ActionResult<Customer>> {
  try {
    await requireSession()
    const activeContext = await requireOrganization()

    const parsed = updateCustomerSchema.safeParse(rawInput)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Dados inválidos'
      return {
        success: false,
        error: firstError,
        statusCode: 400,
      }
    }

    const { id, name, email, phone, notes } = parsed.data

    // Verificar se o cliente pertence à organização ativa antes do update
    const [existing] = await db
      .select({ id: customers.id })
      .from(customers)
      .where(
        and(
          eq(customers.id, id),
          eq(customers.organizationId, activeContext.organization.id)
        )
      )
      .limit(1)

    if (!existing) {
      return {
        success: false,
        error: 'Cliente não encontrado nesta organização',
        statusCode: 404,
      }
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        name,
        email,
        phone,
        notes,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(customers.id, id),
          eq(customers.organizationId, activeContext.organization.id)
        )
      )
      .returning()

    revalidatePath('/customers')
    revalidatePath(`/customers/${id}`)
    revalidatePath(`/customers/${id}/edit`)

    return {
      success: true,
      data: updatedCustomer,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof ForbiddenError) {
      return { success: false, error: error.message, statusCode: error.statusCode }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Erro inesperado ao atualizar cliente' }
  }
}
