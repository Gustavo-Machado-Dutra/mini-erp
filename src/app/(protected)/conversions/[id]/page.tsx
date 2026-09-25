import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getConversionById } from '@/modules/conversions/queries'
import { getRevenue } from '@/modules/revenue/queries'
import { AttributionBadge } from '../attribution-badge'
import {
  CONVERSION_ATTRIBUTION_LABELS,
  CONVERSION_ATTRIBUTION_DESCRIPTIONS,
} from '@/modules/conversions/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Users, Target, CalendarDays, Coins, Plus, DollarSign, Link2 } from 'lucide-react'

interface ConversionDetailPageProps {
  params: Promise<{ id: string }>
}

const formatCurrency = (val: string | null | number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val ?? 0))

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export default async function ConversionDetailPage({ params }: ConversionDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const conversion = await getConversionById(id)

  if (!conversion) {
    notFound()
  }

  const linkedRevenue = await getRevenue({ conversionId: conversion.id, limit: 50 })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/conversions"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Conversões</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes da Conversão</h1>
            <div className="mt-2">
              <AttributionBadge attributionType={conversion.attributionType} />
            </div>
          </div>
          <Link href={`/revenue/new?conversionId=${conversion.id}`}>
            <Button className="flex items-center gap-2">
              <Plus className="size-4" />
              <span>Registrar Receita</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4 text-gray-400" /> Entidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-lg font-semibold text-gray-900">
              {conversion.customerName || conversion.leadName || 'Sem contato'}
            </p>
            {conversion.customerId && (
              <p className="text-xs text-muted-foreground">Vinculado a Cliente</p>
            )}
            {conversion.leadId && (
              <p className="text-xs text-muted-foreground">Vinculado a Lead / Oportunidade</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="size-4 text-gray-400" /> Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(conversion.amount)}</p>
            <p className="text-xs text-muted-foreground mt-1">Valor registrado na conversão.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="size-4 text-gray-400" /> Data da conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-gray-900">{formatDate(conversion.convertedAt)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="size-4 text-gray-400" /> Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {conversion.appointmentId ? (
              <p className="text-sm text-gray-900">Agendamento vinculado</p>
            ) : (
              <p className="text-sm text-muted-foreground">Sem agendamento vinculado</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Atribuição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-gray-900">
            {CONVERSION_ATTRIBUTION_LABELS[conversion.attributionType]}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {CONVERSION_ATTRIBUTION_DESCRIPTIONS[conversion.attributionType]}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Link2 className="size-4 text-gray-400" /> Receitas Vinculadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {linkedRevenue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <DollarSign className="size-6 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhuma receita vinculada a esta conversão ainda.
              </p>
              <Link
                href={`/revenue/new?conversionId=${conversion.id}`}
                className="mt-3 text-sm text-indigo-600 hover:underline flex items-center gap-1"
              >
                <Plus className="size-3.5" /> Registrar receita desta conversão
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {linkedRevenue.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/revenue/${r.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-gray-50 rounded-md px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(r.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(r.occurredAt)}
                        {r.description ? ` · ${r.description}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-indigo-600">Ver receita</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {conversion.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{conversion.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
