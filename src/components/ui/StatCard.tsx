import React from 'react'
import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

const variantStyles = {
  default: 'bg-white border-gray-200',
  primary: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  success: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  warning: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
  error: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
}

const changeStyles = {
  increase: 'text-green-600 bg-green-100',
  decrease: 'text-red-600 bg-red-100',
  neutral: 'text-gray-600 bg-gray-100'
}

const changeIcons = {
  increase: TrendingUp,
  decrease: TrendingDown,
  neutral: Minus
}

export function StatCard({
  title,
  value,
  change,
  icon,
  className,
  variant = 'default'
}: StatCardProps) {
  const ChangeIcon = change ? changeIcons[change.type] : null

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-current"></div>
        <div className="absolute -bottom-2 -left-2 h-16 w-16 rounded-full bg-current"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className="p-2 rounded-xl bg-white/50 text-gray-700">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>

        {/* Change Indicator */}
        {change && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                changeStyles[change.type]
              )}
            >
              {ChangeIcon && <ChangeIcon className="w-3 h-3" />}
              <span>
                {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                {Math.abs(change.value)}%
              </span>
            </div>
            {change.period && (
              <span className="text-xs text-gray-500">
                {change.period}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

