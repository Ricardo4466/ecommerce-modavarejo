import { Link } from 'react-router-dom'

import { cn } from '@/lib/cn'

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'text-[0.8125rem] font-medium tracking-tight',
        className,
      )}
    >
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1.5 p-0">
        {items.map((item, index) => (
          <li
            key={`${item.href ?? 'current'}-${index}-${item.label}`}
            className="flex min-w-0 items-center gap-2"
          >
            {index > 0 ? (
              <span
                aria-hidden
                className="select-none text-[0.55rem] font-normal leading-none text-muted-foreground/55"
              >
                ›
              </span>
            ) : null}
            {item.href != null && item.href !== '' ? (
              <Link
                to={item.href}
                className="truncate text-muted-foreground decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="block truncate font-semibold text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
