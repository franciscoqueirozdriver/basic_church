'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Users, Calendar, DollarSign, Users2, TrendingUp, UserCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface DashboardStats {
  totalPeople: number
  totalServices: number
  totalOfferings: number
  totalGroups: number
  recentAttendance: number
  monthlyGrowth: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPeople: 0,
    totalServices: 0,
    totalOfferings: 0,
    totalGroups: 0,
    recentAttendance: 0,
    monthlyGrowth: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call for dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, this would be API calls
        setStats({
          totalPeople: 245,
          totalServices: 12,
          totalOfferings: 15420.50,
          totalGroups: 8,
          recentAttendance: 180,
          monthlyGrowth: 12.5
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      title: 'Total de Pessoas',
      value: stats.totalPeople.toLocaleString(),
      description: 'Membros cadastrados',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Serviços este Mês',
      value: stats.totalServices.toString(),
      description: 'Cultos e eventos realizados',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Ofertas do Mês',
      value: `R$ ${stats.totalOfferings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: 'Total arrecadado',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Grupos Ativos',
      value: stats.totalGroups.toString(),
      description: 'Células e ministérios',
      icon: Users2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Presença Recente',
      value: stats.recentAttendance.toString(),
      description: 'Último culto',
      icon: UserCheck,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Crescimento Mensal',
      value: `+${stats.monthlyGrowth}%`,
      description: 'Novos membros',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.person?.firstName || user?.email}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das atividades da igreja
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Presença registrada</p>
                  <p className="text-xs text-gray-500">Culto de domingo - 180 pessoas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Novo membro cadastrado</p>
                  <p className="text-xs text-gray-500">Maria Silva adicionada ao sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Oferta registrada</p>
                  <p className="text-xs text-gray-500">R$ 1.250,00 - Culto de domingo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Agenda da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Culto de Quarta</p>
                  <p className="text-xs text-gray-500">Hoje, 19:30</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-green-500 bg-green-50">
                <Users2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Reunião de Células</p>
                  <p className="text-xs text-gray-500">Sexta, 20:00</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Culto de Domingo</p>
                  <p className="text-xs text-gray-500">Domingo, 10:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

