import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getProfessionalById } from '@/modules/professionals/queries'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, UserCheck, Mail, Phone, CheckCircle2, XCircle } from 'lucide-react'

interface ProfessionalDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProfessionalDetailPage({ params }: ProfessionalDetailPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const prof = await getProfessionalById(id)

  if (!prof) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/professionals"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar para Profissionais</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheck className="size-6 text-blue-600" />
            <span>{prof.name}</span>
          </h1>
        </div>

        <Link href={`/professionals/${prof.id}/edit`}>
          <Button className="flex items-center gap-2">
            <Edit className="size-4" />
            <span>Editar Profissional</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              E-mail
            </span>
            {prof.email ? (
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <Mail className="size-4 text-gray-400" />
                <span>{prof.email}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Não informado</span>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Telefone / WhatsApp
            </span>
            {prof.phone ? (
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <Phone className="size-4 text-gray-400" />
                <span>{prof.phone}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400 italic">Não informado</span>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Status na Escala
            </span>
            {prof.active ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="size-3.5" />
                <span>Ativo</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                <XCircle className="size-3.5" />
                <span>Inativo</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}