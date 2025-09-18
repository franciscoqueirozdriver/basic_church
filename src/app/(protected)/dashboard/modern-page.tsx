'use client'

import { useSession } from 'next-auth/react'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/ModernCard'
import { StatCard } from '@/components/ui/StatCard'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Church,
  UserPlus,
  Heart,
  Activity,
  Clock,
  MapPin
} from 'lucide-react'

export default function ModernDashboardPage() {
  const { data: session } = useSession()

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
      icon: <Activity className="w-6 h-6" />,
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

  const recentActivities = [
    {
      type: 'member',
      title: 'Novo membro cadastrado',
      description: 'Maria Silva se juntou à igreja',
      time: '2 horas atrás',
      icon: <UserPlus className="w-5 h-5 text-green-600" />
    },
    {
      type: 'service',
      title: 'Culto de domingo registrado',
      description: '234 pessoas presentes',
      time: '1 dia atrás',
      icon: <Church className="w-5 h-5 text-blue-600" />
    },
    {
      type: 'offering',
      title: 'Oferta registrada',
      description: 'R$ 2.450,00 - Culto da manhã',
      time: '1 dia atrás',
      icon: <DollarSign className="w-5 h-5 text-yellow-600" />
    },
    {
      type: 'group',
      title: 'Reunião de célula',
      description: 'Célula Esperança - 15 presentes',
      time: '2 dias atrás',
      icon: <Heart className="w-5 h-5 text-purple-600" />
    }
  ]

  const upcomingEvents = [
    {
      title: 'Culto de Oração',
      date: 'Hoje, 19:30',
      location: 'Templo Principal',
      attendees: 45
    },
    {
      title: 'Escola Bíblica Dominical',
      date: 'Domingo, 09:00',
      location: 'Salas de Aula',
      attendees: 120
    },
    {
      title: 'Reunião de Líderes',
      date: 'Segunda, 20:00',
      location: 'Sala de Reuniões',
      attendees: 12
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {session?.user?.person?.firstName || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui está um resumo das atividades da sua igreja hoje.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <ModernCard variant="elevated">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Atividades Recentes
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {activity.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {activity.description}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>

        {/* Upcoming Events */}
        <div>
          <ModernCard variant="elevated">
            <ModernCardHeader>
              <ModernCardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Próximos Eventos
              </ModernCardTitle>
            </ModernCardHeader>
            <ModernCardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      {event.title}
                    </h4>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {event.attendees} pessoas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCardContent>
          </ModernCard>
        </div>
      </div>

      {/* Quick Actions */}
      <ModernCard variant="elevated">
        <ModernCardHeader>
          <ModernCardTitle>Ações Rápidas</ModernCardTitle>
        </ModernCardHeader>
        <ModernCardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Novo Membro', icon: <UserPlus className="w-6 h-6" />, color: 'bg-blue-500' },
              { title: 'Registrar Presença', icon: <Activity className="w-6 h-6" />, color: 'bg-green-500' },
              { title: 'Nova Oferta', icon: <DollarSign className="w-6 h-6" />, color: 'bg-yellow-500' },
              { title: 'Criar Evento', icon: <Calendar className="w-6 h-6" />, color: 'bg-purple-500' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-center group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {action.title}
                </p>
              </button>
            ))}
          </div>
        </ModernCardContent>
      </ModernCard>
    </div>
  )
}

