'use client'

import { signOut } from 'next-auth/react'
import { LogOut, User, Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { user } = useAuth()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Sistema de Gestão
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user?.person?.photo ? (
                <img
                  src={user.person.photo}
                  alt={user.person.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.person?.fullName || user?.email}
                </p>
                <p className="text-gray-500 capitalize">
                  {user?.role?.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

