'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/ModernCard'
import { Mail, Lock, Church, ArrowRight } from 'lucide-react'

export default function ModernLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Credenciais inválidas. Verifique seu email e senha.')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Erro interno do servidor. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <ModernCard variant="glass" className="backdrop-blur-xl border-white/30 shadow-2xl">
          <ModernCardHeader className="text-center pb-8">
            {/* Logo */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Church className="w-8 h-8 text-white" />
            </div>
            
            <ModernCardTitle size="xl" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Igreja App
            </ModernCardTitle>
            <p className="text-gray-600 mt-2 font-medium">
              Sistema de Gestão da Igreja
            </p>
          </ModernCardHeader>

          <ModernCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <ModernInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                variant="filled"
                size="lg"
                required
                placeholder="seu@email.com"
              />

              <ModernInput
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                variant="filled"
                size="lg"
                required
                placeholder="••••••••"
              />

              <ModernButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </ModernButton>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Credenciais de Teste:
              </h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Admin:</strong> admin@igreja.com / admin123</p>
                <p><strong>Pastor:</strong> pastor@igreja.com / pastor123</p>
              </div>
            </div>
          </ModernCardContent>
        </ModernCard>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Desenvolvido com ❤️ para a comunidade cristã
          </p>
        </div>
      </div>
    </div>
  )
}

