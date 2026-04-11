import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/cn'
import { useThemeStore } from '@/lib/stores/theme-store'

const btnIcon =
  'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-[color,background-color,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const btnIconMinimal =
  'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

type ThemeToggleProps = {
  /**
   * `default` — claro, sistema (monitor) e escuro (vitrine / menu mobile).
   * `binary` — só claro e escuro (header admin enxuto).
   */
  variant?: 'default' | 'binary'
  /**
   * `minimal` — só ícones, sem borda nem fundo de pílula (ex.: drawer mobile).
   */
  appearance?: 'default' | 'minimal'
}

type SegmentedProps = {
  includeSystem: boolean
  appearance: 'default' | 'minimal'
}

function ThemeToggleSegmented({ includeSystem, appearance }: SegmentedProps) {
  const preference = useThemeStore((s) => s.preference)
  const setPreference = useThemeStore((s) => s.setPreference)
  const [resolvedDark, setResolvedDark] = useState(false)

  useEffect(() => {
    const sync = () => setResolvedDark(document.documentElement.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [preference])

  const sunActiveBinary =
    preference === 'light' || (preference === 'system' && !resolvedDark)
  const moonActiveBinary =
    preference === 'dark' || (preference === 'system' && resolvedDark)

  const sunActiveTernary = preference === 'light'
  const systemActive = preference === 'system'
  const moonActiveTernary = preference === 'dark'

  const sunOn = includeSystem ? sunActiveTernary : sunActiveBinary
  const moonOn = includeSystem ? moonActiveTernary : moonActiveBinary

  const isMinimal = appearance === 'minimal'

  return (
    <div
      className={cn(
        'inline-flex items-center',
        isMinimal ? 'gap-1' : 'gap-0.5 rounded-full border border-border bg-surface p-0.5 shadow-xs',
      )}
      role="group"
      aria-label="Tema da interface"
    >
      <button
        type="button"
        aria-pressed={sunOn}
        aria-label="Tema claro"
        onClick={() => setPreference('light')}
        className={cn(
          isMinimal ? btnIconMinimal : btnIcon,
          isMinimal
            ? sunOn
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
            : sunOn
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        <Sun className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
      {includeSystem ? (
        <button
          type="button"
          aria-pressed={systemActive}
          aria-label="Seguir tema do sistema"
          onClick={() => setPreference('system')}
          className={cn(
            isMinimal ? btnIconMinimal : btnIcon,
            isMinimal
              ? systemActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
              : systemActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
          )}
        >
          <Monitor className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      ) : null}
      <button
        type="button"
        aria-pressed={moonOn}
        aria-label="Tema escuro"
        onClick={() => setPreference('dark')}
        className={cn(
          isMinimal ? btnIconMinimal : btnIcon,
          isMinimal
            ? moonOn
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
            : moonOn
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        <Moon className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export function ThemeToggle({
  variant = 'default',
  appearance = 'default',
}: ThemeToggleProps) {
  if (variant === 'binary') {
    return <ThemeToggleSegmented includeSystem={false} appearance={appearance} />
  }
  return <ThemeToggleSegmented includeSystem={true} appearance={appearance} />
}
