'use client'

import { ModernLayout } from '@/components/layout/ModernLayout'
import { ModernCard, ModernCardContent, ModernCardHeader, ModernCardTitle } from '@/components/ui/ModernCard'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { StatCard } from '@/components/ui/StatCard'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Heart,
  Mail,
  Lock,
  Search,
  Plus,
  Download,
  Share,
  Star
} from 'lucide-react'

export default function DemoModernPage() {
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
    <ModernLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">
            Design System Moderno
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Demonstração dos componentes modernizados do sistema de gestão da igreja
          </p>
        </div>

        {/* Stats Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cartões de Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Botões Modernos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Variantes de Botões</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-3">
                  <ModernButton variant="primary" className="w-full">
                    Primary Button
                  </ModernButton>
                  <ModernButton variant="secondary" className="w-full">
                    Secondary Button
                  </ModernButton>
                  <ModernButton variant="outline" className="w-full">
                    Outline Button
                  </ModernButton>
                  <ModernButton variant="ghost" className="w-full">
                    Ghost Button
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Tamanhos</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-3">
                  <ModernButton size="sm" className="w-full">
                    Small Button
                  </ModernButton>
                  <ModernButton size="md" className="w-full">
                    Medium Button
                  </ModernButton>
                  <ModernButton size="lg" className="w-full">
                    Large Button
                  </ModernButton>
                  <ModernButton size="xl" className="w-full">
                    Extra Large
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Com Ícones</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-3">
                  <ModernButton 
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="w-full"
                  >
                    Adicionar
                  </ModernButton>
                  <ModernButton 
                    variant="outline"
                    rightIcon={<Download className="w-4 h-4" />}
                    className="w-full"
                  >
                    Download
                  </ModernButton>
                  <ModernButton 
                    variant="secondary"
                    leftIcon={<Share className="w-4 h-4" />}
                    rightIcon={<Star className="w-4 h-4" />}
                    className="w-full"
                  >
                    Compartilhar
                  </ModernButton>
                  <ModernButton 
                    loading={true}
                    className="w-full"
                  >
                    Carregando...
                  </ModernButton>
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        </div>

        {/* Inputs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campos de Entrada Modernos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Variantes</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-4">
                  <ModernInput
                    label="Campo Padrão"
                    placeholder="Digite aqui..."
                    variant="default"
                  />
                  <ModernInput
                    label="Campo Preenchido"
                    placeholder="Digite aqui..."
                    variant="filled"
                  />
                  <ModernInput
                    label="Campo Contornado"
                    placeholder="Digite aqui..."
                    variant="outlined"
                  />
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Com Ícones</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-4">
                  <ModernInput
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    leftIcon={<Mail className="w-5 h-5" />}
                    variant="filled"
                  />
                  <ModernInput
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-5 h-5" />}
                    variant="filled"
                  />
                  <ModernInput
                    label="Buscar"
                    placeholder="Buscar pessoas..."
                    leftIcon={<Search className="w-5 h-5" />}
                    variant="outlined"
                  />
                </div>
              </ModernCardContent>
            </ModernCard>

            <ModernCard>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Estados</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="space-y-4">
                  <ModernInput
                    label="Campo Normal"
                    placeholder="Digite aqui..."
                    variant="filled"
                  />
                  <ModernInput
                    label="Com Erro"
                    placeholder="Digite aqui..."
                    variant="filled"
                    error="Este campo é obrigatório"
                  />
                  <ModernInput
                    label="Com Dica"
                    placeholder="Digite aqui..."
                    variant="filled"
                    hint="Mínimo 8 caracteres"
                  />
                </div>
              </ModernCardContent>
            </ModernCard>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cartões Modernos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernCard variant="default" hover>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Cartão Padrão</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-gray-600 text-sm">
                  Este é um cartão com estilo padrão e efeito hover.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="elevated" hover>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Cartão Elevado</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-gray-600 text-sm">
                  Este cartão tem uma sombra mais pronunciada.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="outlined" hover>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Cartão Contornado</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-gray-600 text-sm">
                  Este cartão tem uma borda mais espessa.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glass" hover>
              <ModernCardHeader>
                <ModernCardTitle size="sm">Cartão Glass</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-gray-600 text-sm">
                  Este cartão tem efeito de vidro fosco.
                </p>
              </ModernCardContent>
            </ModernCard>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Paleta de Cores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Primary', colors: ['bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700', 'bg-blue-900'] },
              { name: 'Secondary', colors: ['bg-purple-100', 'bg-purple-300', 'bg-purple-500', 'bg-purple-700', 'bg-purple-900'] },
              { name: 'Success', colors: ['bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700', 'bg-green-900'] },
              { name: 'Warning', colors: ['bg-yellow-100', 'bg-yellow-300', 'bg-yellow-500', 'bg-yellow-700', 'bg-yellow-900'] },
              { name: 'Error', colors: ['bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-red-700', 'bg-red-900'] }
            ].map((palette) => (
              <ModernCard key={palette.name}>
                <ModernCardHeader>
                  <ModernCardTitle size="sm">{palette.name}</ModernCardTitle>
                </ModernCardHeader>
                <ModernCardContent>
                  <div className="space-y-2">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className={`h-8 rounded-lg ${color}`}
                      />
                    ))}
                  </div>
                </ModernCardContent>
              </ModernCard>
            ))}
          </div>
        </div>
      </div>
    </ModernLayout>
  )
}

