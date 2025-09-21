// src/app/(protected)/layout.tsx
import ProtectedLayout from '@/components/auth/ProtectedLayout'

export default function ProtectedSegmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>
}
