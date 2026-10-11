"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as z from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
})

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError('')

    const result = registerSchema.safeParse({ name, email, password })
    if (!result.success) {
      setError(result.error.issues[0].message)
      setPending(false)
      return
    }

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      })

      if (signUpError) {
        setError(signUpError.status >= 500
          ? 'O serviço de cadastro está indisponível. Tente novamente em alguns instantes.'
          : signUpError.message || 'Não foi possível realizar o cadastro.')
        return
      }

      if (!data) {
        setError('Não foi possível confirmar o cadastro. Tente novamente.')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Não foi possível conectar ao serviço de cadastro. Verifique sua conexão e tente novamente.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-sm text-gray-500 mt-2">Junte-se ao RevenueFlow</p>
      </div>
      
      {error && (
        <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input 
            id="name" 
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            name="email"
            autoComplete="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input 
            id="password" 
            name="password"
            autoComplete="new-password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? 'Criando conta...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Fazer login
        </Link>
      </div>
    </>
  )
}
