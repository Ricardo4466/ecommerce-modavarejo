import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/cn'

export type SelectOption = { value: string; label: string }

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'size'
> & {
  options: SelectOption[]
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  id?: string
}

const triggerBase =
  'group flex w-full min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-left text-sm font-normal text-text-h shadow-xs transition-[color,background-color,border-color,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] hover:border-primary/20 hover:bg-muted/25 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-muted/15'

const listboxPanel =
  'absolute left-0 right-0 top-[calc(100%+0.375rem)] z-[100] max-h-60 overflow-y-auto overflow-x-hidden rounded-xl border border-border/90 bg-surface py-1.5 shadow-[0_12px_40px_-12px_rgba(15,15,15,0.18)] dark:border-border dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.55)]'

function emitChange(
  value: string,
  onChange: SelectProps['onChange'],
): void {
  if (!onChange) return
  const synthetic = {
    target: { value },
    currentTarget: { value },
  } as ChangeEvent<HTMLSelectElement>
  onChange(synthetic)
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  function Select(
    {
      label,
      hint,
      error,
      id: idProp,
      options,
      className,
      disabled,
      value: valueProp,
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) {
    const {
      name,
      required,
      autoComplete,
      form: formId,
      multiple: _multiple,
      ...restForButton
    } = rest

    const uid = useId()
    const id = idProp ?? uid
    const listboxId = `${id}-listbox`
    const hintId = hint ? `${id}-hint` : undefined
    const errorId = error ? `${id}-error` : undefined

    const buttonRef = useRef<HTMLButtonElement | null>(null)
    useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement, [])

    const focusButton = useCallback(() => {
      queueMicrotask(() => buttonRef.current?.focus())
    }, [])

    const isControlled = valueProp !== undefined
    const [internalValue, setInternalValue] = useState(
      () => defaultValue?.toString() ?? options[0]?.value ?? '',
    )

    const currentValue = isControlled ? String(valueProp) : internalValue

    const selectedOption =
      options.find((o) => o.value === currentValue) ?? options[0]
    const displayLabel = selectedOption?.label ?? ''

    const [open, setOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(() =>
      Math.max(
        0,
        options.findIndex((o) => o.value === currentValue),
      ),
    )

    const rootRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)
    const optionRefs = useRef<(HTMLLIElement | null)[]>([])

    const pickOption = useCallback(
      (opt: SelectOption) => {
        if (!isControlled) {
          setInternalValue(opt.value)
        }
        emitChange(opt.value, onChange)
        setOpen(false)
        focusButton()
      },
      [isControlled, onChange, focusButton],
    )

    useEffect(() => {
      if (!open) return
      const idx = options.findIndex((o) => o.value === currentValue)
      setHighlightedIndex(idx >= 0 ? idx : 0)
    }, [open, currentValue, options])

    useEffect(() => {
      if (!open) return
      const el = optionRefs.current[highlightedIndex]
      el?.scrollIntoView({ block: 'nearest' })
    }, [highlightedIndex, open])

    useEffect(() => {
      if (!open) return
      function handlePointer(e: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
          setOpen(false)
          focusButton()
        }
      }
      document.addEventListener('mousedown', handlePointer)
      return () => document.removeEventListener('mousedown', handlePointer)
    }, [open, focusButton])

    useEffect(() => {
      if (!open) return
      function handleKey(e: globalThis.KeyboardEvent) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setOpen(false)
          focusButton()
        }
      }
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }, [open, focusButton])

    useEffect(() => {
      if (open) {
        queueMicrotask(() => listRef.current?.focus())
      }
    }, [open])

    const handleButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (!open) {
          setOpen(true)
          return
        }
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (open) {
          e.preventDefault()
          const opt = options[highlightedIndex]
          if (opt) pickOption(opt)
        }
      }
    }

    const handleListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
      if (!open) return
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          setHighlightedIndex((i) => Math.min(i + 1, options.length - 1))
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          setHighlightedIndex((i) => Math.max(i - 1, 0))
          break
        }
        case 'Home': {
          e.preventDefault()
          setHighlightedIndex(0)
          break
        }
        case 'End': {
          e.preventDefault()
          setHighlightedIndex(options.length - 1)
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          const opt = options[highlightedIndex]
          if (opt) pickOption(opt)
          break
        }
        default:
          break
      }
    }

    const describedBy =
      [hintId, errorId].filter(Boolean).join(' ') || undefined

    const control = (
      <div ref={rootRef} className={cn('relative min-w-0', label || hint || error ? '' : 'w-full')}>
        {name != null ? (
          <input
            type="hidden"
            name={name}
            form={formId}
            value={currentValue}
            readOnly
          />
        ) : null}
        <button
          {...(restForButton as ButtonHTMLAttributes<HTMLButtonElement>)}
          ref={buttonRef}
          type="button"
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-required={required ? true : undefined}
          aria-autocomplete={autoComplete ? 'list' : undefined}
          className={cn(
            triggerBase,
            open && 'border-primary/35 ring-1 ring-primary/15',
            error && 'border-destructive ring-destructive/30',
            className,
          )}
          onClick={() => {
            if (!disabled) setOpen((o) => !o)
          }}
          onKeyDown={handleButtonKeyDown}
        >
          <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
            strokeWidth={2}
            aria-hidden
          />
        </button>

        {open ? (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            tabIndex={0}
            className={listboxPanel}
            onKeyDown={handleListKeyDown}
          >
            {options.map((opt, index) => {
              const selected = currentValue === opt.value
              const highlighted = highlightedIndex === index
              return (
                <li
                  key={`${opt.value}-${opt.label}`}
                  ref={(el) => {
                    optionRefs.current[index] = el
                  }}
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    'mx-1 flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm text-text transition-colors',
                    highlighted && !selected && 'bg-muted/70',
                    selected &&
                      'bg-primary/12 font-medium text-primary dark:bg-primary/18',
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    pickOption(opt)
                  }}
                >
                  {opt.label}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    )

    if (!label && !hint && !error) {
      return control
    }

    return (
      <div className="flex min-w-0 flex-col gap-1.5">
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
