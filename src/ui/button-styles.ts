import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const easePremium = '[transition-timing-function:cubic-bezier(0.33,1,0.68,1)]'

const baseStyles = `inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-500 ${easePremium} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50`

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent-foreground shadow-sm shadow-foreground/5 hover:bg-accent-hover hover:shadow-md hover:shadow-primary/10 active:brightness-[0.98]',
  secondary:
    'border border-border/90 bg-secondary text-secondary-foreground shadow-xs hover:border-primary/15 hover:bg-secondary-200/75 hover:shadow-sm dark:hover:bg-secondary-800/75',
  ghost:
    'text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-xs',
  md: 'h-10 rounded-lg px-4 text-sm',
  lg: 'h-12 rounded-lg px-6 text-base',
}

export function buttonStyles(opts?: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  const { variant = 'primary', size = 'md', className } = opts ?? {}
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className)
}
