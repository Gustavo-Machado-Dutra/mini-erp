import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireSession, requireOrganizationForPage } from '@/modules/tenancy/context'
import { getProfessionalById } from '@/modules/professionals/queries'
import { ProfessionalForm } from '../../professional-form'
import { ArrowLeft } from 'lucide-react'

interface EditProfessionalPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProfessionalPage({ params }: EditProfessionalPageProps) {
  await requireSession()
  await requireOrganizationForPage()

  const { id } = await params
  const prof = await getProfessionalById(id)

  if (!prof) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href={`/professionals/${prof.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="size-4" />
          <span>Voltar para Detalhes</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Profissional</h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualize os dados cadastrais de {prof.name}.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <ProfessionalForm mode="edit" initialData={prof} />
      </div>
    </div>
  )
}