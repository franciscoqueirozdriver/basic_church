'use client'

import { useState } from 'react'
import { ModernSidebar } from './ModernSidebar'
import { ModernHeader } from './ModernHeader'
import { cn } from '@/utils/cn'

interface ModernLayoutProps {
  children: React.ReactNode
  className?: string
}

export function ModernLayout({ children, className }: ModernLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <ModernSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <ModernHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className={cn(
          'p-6 animate-fade-in',
          className
        )}>
          <div className="container-modern">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

