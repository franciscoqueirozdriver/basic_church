'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  UserCheck, 
  Users2, 
  DollarSign, 
  CalendarDays, 
  MessageSquare, 
  BarChart3,
  Settings,
  Home
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'

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

export function Sidebar() {
  const pathname = usePathname()
  const { hasAnyPermission } = useAuth()

  const filteredNavigation = navigation.filter(item => 
    item.permissions.length === 0 || hasAnyPermission(item.permissions)
  )

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white">Igreja App</h1>
      </div>
      
      <nav className="flex flex-1 flex-col px-6 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}

