import React from 'react'
import { cn } from '@/utils/cn'

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  elevated: 'bg-white shadow-lg border-0',
  outlined: 'bg-white border-2 border-gray-200 shadow-none',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg'
}

const cardPadding = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10'
}

export function ModernCard({ 
  className, 
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  ...props 
}: ModernCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 ease-in-out',
        cardVariants[variant],
        cardPadding[padding],
        hover && 'hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ModernCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
}

export function ModernCardHeader({ 
  className, 
  gradient = false,
  children,
  ...props 
}: ModernCardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-2 pb-4 border-b border-gray-100',
        gradient && 'bg-gradient-to-r from-blue-50 to-purple-50 -m-6 mb-4 p-6 rounded-t-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ModernCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ModernCardTitle({ 
  className, 
  size = 'md',
  children,
  ...props 
}: ModernCardTitleProps) {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  }

  return (
    <h3
      className={cn(
        'text-gray-900 leading-tight tracking-tight',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

interface ModernCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function ModernCardDescription({ 
  className, 
  children,
  ...props 
}: ModernCardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-gray-600 text-sm leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

interface ModernCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ModernCardContent({ 
  className, 
  children,
  ...props 
}: ModernCardContentProps) {
  return (
    <div
      className={cn('pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface ModernCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between'
}

export function ModernCardFooter({ 
  className, 
  justify = 'end',
  children,
  ...props 
}: ModernCardFooterProps) {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div
      className={cn(
        'flex items-center pt-4 mt-4 border-t border-gray-100',
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

