import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/85 bg-card text-foreground shadow-md',
        'ring-1 ring-foreground/[0.04] transition-shadow duration-300 ease-out',
        'hover:shadow-lg dark:ring-white/[0.06]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
