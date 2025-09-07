'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Role } from '@prisma/client'

interface ProtectedRouteProps {
  children: ReactNode
  permissions?: string[]
  roles?: Role[]
  requireAll?: boolean
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  permissions = [],
  roles = [],
  requireAll = false,
  fallback = <div className="p-4 text-center text-red-600">Acesso negado</div>
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return fallback
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(user.role)) {
    return fallback
  }

  // Check permission-based access
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)
    
    if (!hasAccess) {
      return fallback
    }
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute roles={['ADMIN']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function PastorOrAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute roles={['ADMIN', 'PASTOR']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function TesourariaOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute roles={['ADMIN', 'TESOURARIA']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

