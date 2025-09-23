import React from 'react'
import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

export interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl border-0',
  secondary: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl border-0',
  outline: 'border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 bg-white hover:bg-blue-50 shadow-sm hover:shadow-md',
  ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-0 shadow-none',
  destructive: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl border-0',
  success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl border-0'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-lg',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl',
  lg: 'px-6 py-3 text-base font-semibold rounded-xl',
  xl: 'px-8 py-4 text-lg font-bold rounded-2xl'
}

export function ModernButton({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ModernButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        
        // Variant styles
        buttonVariants[variant],
        
        // Size styles
        buttonSizes[size],
        
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {children && (
        <span className={cn(
          'flex-1',
          (leftIcon || rightIcon || loading) && 'text-center'
        )}>
          {children}
        </span>
      )}
      
      {!loading && rightIcon && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  )
}
