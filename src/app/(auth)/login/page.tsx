"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setError('')

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })

    if (signInError) {
      setError('Credenciais inválidas.')
      setPending(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">RevenueFlow</h1>
        <p className="text-sm text-gray-500 mt-2">Bem-vindo de volta</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
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
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </div>
    </>
  )
}