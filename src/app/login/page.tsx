<<<<<<< HEAD

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/ModernCard'
import { Mail, Lock, Eye, EyeOff, LogIn, Church, ArrowRight } from 'lucide-react'

export default function ModernLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
=======
// src/app/login/page.tsx
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModernButton } from '@/components/ui/ModernButton';
import { ModernInput } from '@/components/ui/ModernInput';
import {
  ModernCard,
  ModernCardContent,
  ModernCardHeader,
  ModernCardTitle,
} from '@/components/ui/ModernCard';
import { Mail, Lock, LogIn } from 'lucide-react';

// Evita problemas de prerender ao usar useSearchParams
export const dynamic = 'force-dynamic';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Captura callbackUrl (padrão: /dashboard)
  const callbackUrl = useMemo(
    () => searchParams.get('callbackUrl') || '/dashboard',
    [searchParams]
  );

  // Lê possíveis erros passados via query (?error=...)
  const authErrorFromQuery = searchParams.get('error');
  useEffect(() => {
    if (authErrorFromQuery) {
      setLocalError(
        authErrorFromQuery === 'CredentialsSignin'
          ? 'Credenciais inválidas. Verifique seu e-mail e senha.'
          : 'Não foi possível autenticar. Tente novamente.'
      );
    }
  }, [authErrorFromQuery]);
>>>>>>> de4ea2b (chore: sync local -> GitHub)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

<<<<<<< HEAD
=======
    if (!email || !password) {
      setLocalError('Informe e-mail e senha.');
      return;
    }

    setLoading(true);
>>>>>>> de4ea2b (chore: sync local -> GitHub)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

<<<<<<< HEAD
      if (result?.error) {
        setError('Credenciais inválidas. Verifique seu e-mail e senha.')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.')
      console.error(err)
=======
      if (!result) {
        setLocalError('Resposta inesperada do servidor. Tente novamente.');
        return;
      }

      if (result.error) {
        setLocalError('Credenciais inválidas. Verifique seu e-mail e senha.');
        return;
      }

      router.replace(result.url ?? callbackUrl);
    } catch (err) {
      console.error(err);
      setLocalError('Ocorreu um erro inesperado. Tente novamente.');
>>>>>>> de4ea2b (chore: sync local -> GitHub)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <ModernCard variant="elevated" className="w-full max-w-md animate-fade-in-up">
        <ModernCardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <ModernCardTitle size="lg" className="text-gradient-primary">Bem-vindo de volta!</ModernCardTitle>
          <p className="text-gray-600 mt-2">Digite suas credenciais para acessar o sistema.</p>
        </ModernCardHeader>
        <ModernCardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernInput
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              variant="filled"
              required
            />
            <ModernInput
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
              variant="filled"
              required
            />

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <ModernButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Entrar
            </ModernButton>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
<<<<<<< HEAD
            Usuário de teste: <span className="font-semibold text-gray-700">admin@igreja.com</span> / <span className="font-semibold text-gray-700">admin123</span>
=======
            Usuário de teste:{' '}
            <span className="font-semibold text-gray-700">admin@igreja.com</span>{' '}
            / <span className="font-semibold text-gray-700">admin123</span>
>>>>>>> de4ea2b (chore: sync local -> GitHub)
          </p>
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}

<<<<<<< HEAD

=======
export default function ModernLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
>>>>>>> de4ea2b (chore: sync local -> GitHub)
