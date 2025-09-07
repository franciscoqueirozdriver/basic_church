import { useSession } from 'next-auth/react'
import { SessionUser, hasPermission, hasAnyPermission, hasAllPermissions } from '@/types/auth'

export function useAuth() {
  const { data: session, status } = useSession()
  
  const user = session?.user as SessionUser | undefined
  
  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    hasPermission: (permission: string) => 
      user ? hasPermission(user.role, permission) : false,
    hasAnyPermission: (permissions: string[]) =>
      user ? hasAnyPermission(user.role, permissions) : false,
    hasAllPermissions: (permissions: string[]) =>
      user ? hasAllPermissions(user.role, permissions) : false,
    isAdmin: user?.role === 'ADMIN',
    isPastor: user?.role === 'PASTOR',
    isTesouraria: user?.role === 'TESOURARIA',
    isCoordGrupos: user?.role === 'COORD_GRUPOS',
    isRecepcao: user?.role === 'RECEPCAO',
    isMembro: user?.role === 'MEMBRO'
  }
}

