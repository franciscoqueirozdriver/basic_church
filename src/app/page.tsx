'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    // Evita “loop” no histórico usando replace()
    if (session) {
      router.replace('/dashboard')
    } else {
      // Mantém callbackUrl para voltar à home após login
      const params = new URLSearchParams({ callbackUrl: '/' })
      router.replace(`/login?${params.toString()}`)
    }
  }, [session, status, router])

  // Loading/skeleton enquanto decide pra onde ir
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}
