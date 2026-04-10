import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ErrorStateProps = {
  icon?: LucideIcon
  title: string
  description?: string
  className?: string
  role?: 'alert' | 'status'
  children?: ReactNode
}

export function ErrorState({
  icon: Icon,
  title,
  description,
  className,
  role = 'alert',
  children,
}: ErrorStateProps) {
  const DefaultIcon = Icon
  return (
    <div
      role={role}
      className={cn(
        'rounded-[1.35rem] border border-destructive/20 bg-destructive/[0.04] px-7 py-12 text-center shadow-md shadow-foreground/[0.03] backdrop-blur-sm sm:px-9 sm:py-14',
        className,
      )}
    >
      {DefaultIcon ? (
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
          <DefaultIcon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
        </span>
      ) : null}
      <p className="text-base font-semibold text-text-h sm:text-lg">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  )
}
