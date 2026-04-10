import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'

import { cn } from '@/lib/cn'

const inputStyles =
  'flex w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-h placeholder:text-muted-foreground shadow-xs transition-[color,background-color,border-color,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  id?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, hint, error, id: idProp, className, disabled, ...rest },
    ref,
  ) {
    const uid = useId()
    const id = idProp ?? uid
    const hintId = hint ? `${id}-hint` : undefined
    const errorId = error ? `${id}-error` : undefined

    const control = (
      <input
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={cn(
          inputStyles,
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        {...rest}
      />
    )

    if (!label && !hint && !error) {
      return control
    }

    return (
      <div className="flex flex-col gap-1.5 min-w-0">
        {label != null && (
          <label
            htmlFor={id}
            className="text-xs font-medium text-muted-foreground"
          >
            {label}
          </label>
        )}
        {control}
        {hint != null && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        {error != null && (
          <p id={errorId} className="text-xs font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
