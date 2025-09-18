
'use client'

import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/ModernCard'
import { StatCard } from '@/components/ui/StatCard'
import { ModernButton } from '@/components/ui/ModernButton'
import { Users, Calendar, DollarSign, Heart, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'

export default function ModernDashboardPage() {
  const stats = [
    {
      title: 'Total de Membros',
      value: '1,247',
      change: { value: 12, type: 'increase' as const, period: 'este mês' },
      icon: <Users className="w-6 h-6" />,
      variant: 'primary' as const
    },
    {
      title: 'Presença Média',
      value: '89%',
      change: { value: 5, type: 'increase' as const, period: 'últimos 30 dias' },
      icon: <Calendar className="w-6 h-6" />,
      variant: 'success' as const
    },
    {
      title: 'Ofertas do Mês',
      value: 'R$ 45.230',
      change: { value: 8, type: 'increase' as const, period: 'vs mês anterior' },
      icon: <DollarSign className="w-6 h-6" />,
      variant: 'warning' as const
    },
    {
      title: 'Grupos Ativos',
      value: '24',
      change: { value: 2, type: 'increase' as const, period: 'novos grupos' },
      icon: <Heart className="w-6 h-6" />,
      variant: 'default' as const
    }
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModernCard className="lg:col-span-2">
          <ModernCardHeader>
            <ModernCardTitle>Atividade Recente</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Novo membro cadastrado</p>
                    <p className="text-xs text-gray-500">Maria Silva se juntou à igreja</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">2 min atrás</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Oferta registrada</p>
                    <p className="text-xs text-gray-500">R$ 1.250,00 - Culto de domingo</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">1 hora atrás</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reunião de célula</p>
                    <p className="text-xs text-gray-500">Célula Esperança - 15 presentes</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">2 horas atrás</span>
              </li>
            </ul>
          </ModernCardContent>
        </ModernCard>

        <ModernCard>
          <ModernCardHeader>
            <ModernCardTitle>Ações Rápidas</ModernCardTitle>
          </ModernCardHeader>
          <ModernCardContent>
            <div className="space-y-3">
              <ModernButton variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Registrar Oferta
              </ModernButton>
              <ModernButton variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Novo Membro
              </ModernButton>
              <ModernButton variant="outline" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Lançar Presença
              </ModernButton>
            </div>
          </ModernCardContent>
        </ModernCard>
      </div>

      {/* Charts Placeholder */}
      <ModernCard>
        <ModernCardHeader>
          <ModernCardTitle>Gráficos de Tendência</ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent className="h-64 flex items-center justify-center text-gray-400">
          <p>Gráficos de tendência de membros, ofertas e presença virão aqui.</p>
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}


