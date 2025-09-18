'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  Heart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Church,
  UserCheck,
  MessageSquare,
  BarChart3,
  Bell,
  CalendarDays,
  Users2
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permissions: []
  },
  {
    name: 'Pessoas',
    href: '/people',
    icon: Users,
    permissions: ['people:read']
  },
  {
    name: 'Serviços',
    href: '/services',
    icon: Calendar,
    permissions: ['attendance:read']
  },
  {
    name: 'Grupos',
    href: '/groups',
    icon: Users2,
    permissions: ['groups:read']
  },
  {
    name: 'Ofertas',
    href: '/offerings',
    icon: DollarSign,
    permissions: ['offerings:read']
  },
  {
    name: 'Eventos',
    href: '/events',
    icon: CalendarDays,
    permissions: ['events:read']
  },
  {
    name: 'Comunicação',
    href: '/communication',
    icon: MessageSquare,
    permissions: ['communication:read']
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    permissions: ['reports:read']
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: Settings,
    permissions: ['settings:read']
  }
]

interface ModernSidebarProps {
  className?: string
}

export function ModernSidebar({ className }: ModernSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { hasAnyPermission } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    item.permissions.length === 0 || hasAnyPermission(item.permissions)
  )

  return (
    <div
      className={cn(
        'flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className={cn(
          'flex items-center gap-3 transition-opacity duration-200',
          collapsed && 'opacity-0'
        )}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <Church className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Igreja App
            </h1>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:scale-[1.01]'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700',
                'group-hover:scale-110'
              )} />
              
              <span className={cn(
                'transition-opacity duration-200',
                collapsed && 'opacity-0'
              )}>
                {item.name}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.name}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:shadow-md transition-all duration-200',
          collapsed && 'justify-center'
        )}>
          <div className="relative">
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">3</span>
            </div>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium text-blue-900">Notificações</p>
              <p className="text-xs text-blue-700">3 novas mensagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

