'use client'

import { useEffect, useMemo, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, LogIn } from 'lucide-react'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui/ModernCard'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const callbackUrl = useMemo(
    () => searchParams.get('callbackUrl') || '/dashboard',
    [searchParams]
  )

  const authErrorFromQuery = searchParams.get('error')

  useEffect(() => {
    if (!authErrorFromQuery) {
      return
    }

    setLocalError(
      authErrorFromQuery === 'CredentialsSignin'
        ? 'Credenciais inválidas. Verifique seu e-mail e senha.'
        : 'Não foi possível autenticar. Tente novamente.'
    )
  }, [authErrorFromQuery])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email || !password) {
      setLocalError('Informe e-mail e senha.')
      return
    }

    setLoading(true)
    setLocalError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (!result) {
        setLocalError('Resposta inesperada do servidor. Tente novamente.')
        return
      }

      if (result.error) {
        setLocalError('Credenciais inválidas. Verifique seu e-mail e senha.')
        return
      }

      router.replace(result.url ?? callbackUrl)
    } catch (error) {
      console.error(error)
      setLocalError('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <ModernCard variant="elevated" className="w-full max-w-md animate-fade-in-up">
        <ModernCardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <ModernCardTitle size="lg" className="text-gradient-primary">
            Bem-vindo de volta!
          </ModernCardTitle>
          <p className="mt-2 text-gray-600">
            Digite suas credenciais para acessar o sistema.
          </p>
        </ModernCardHeader>
        <ModernCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              leftIcon={<Mail className="h-5 w-5" />}
              variant="filled"
              required
            />
            <ModernInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              leftIcon={<Lock className="h-5 w-5" />}
              variant="filled"
              required
            />

            {localError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {localError}
              </div>
            )}

            <ModernButton
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              leftIcon={<LogIn className="h-5 w-5" />}
            >
              Entrar
            </ModernButton>
          </form>
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}
