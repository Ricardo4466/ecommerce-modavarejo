import type { LucideIcon } from 'lucide-react'
import type { AriaRole, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: string
  className?: string
  role?: AriaRole
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  role,
  children,
}: EmptyStateProps) {
  return (
    <div
      role={role}
      className={cn(
        'flex flex-col items-center rounded-[1.35rem] border border-border/75 bg-card/95 px-7 py-14 text-center shadow-lg shadow-foreground/[0.04] backdrop-blur-sm sm:px-12 sm:py-16',
        className,
      )}
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-text-h sm:text-xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}
