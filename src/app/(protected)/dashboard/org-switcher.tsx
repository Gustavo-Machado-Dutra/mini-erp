'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { switchOrganizationAction } from '@/modules/tenancy/actions'
import type { UserOrganizationItem } from '@/modules/tenancy/types'
import { Button } from '@/components/ui/button'

interface OrgSwitcherProps {
  organizations: UserOrganizationItem[]
  currentOrgId?: string
}

export function OrgSwitcher({ organizations, currentOrgId }: OrgSwitcherProps) {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrgId || pending) return
    setPending(true)
    const res = await switchOrganizationAction(orgId)
    setPending(false)
    if (res.success) {
      router.refresh()
    }
  }

  if (organizations.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">Trocar Organização:</span>
      <div className="flex flex-wrap gap-1">
        {organizations.map((org) => {
          const isActive = org.id === currentOrgId
          return (
            <Button
              key={org.id}
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              disabled={pending || isActive}
              onClick={() => handleSwitch(org.id)}
            >
              {org.name} ({org.role})
            </Button>
          )
        })}
      </div>
    </div>
  )
}