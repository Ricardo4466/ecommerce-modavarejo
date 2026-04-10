import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type PageIntroProps = {
  title: string
  description?: ReactNode
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

/**
 * Cabeçalho típico de páginas internas (título + texto de apoio).
 */
export function PageIntro({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: PageIntroProps) {
  return (
    <header className={cn('page__header', className)}>
      <h1 className={titleClassName}>{title}</h1>
      {description != null ? (
        <p className={cn('muted max-w-2xl', descriptionClassName)}>{description}</p>
      ) : null}
    </header>
  )
}
