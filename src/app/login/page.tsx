// src/app/login/page.tsx
import { Suspense } from 'react'
import { LoginClient } from './LoginClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  )
}
