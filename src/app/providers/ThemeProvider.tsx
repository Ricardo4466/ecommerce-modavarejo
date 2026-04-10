import { useEffect, type ReactNode } from 'react'

import { useThemeStore } from '@/lib/stores/theme-store'

type Props = { children: ReactNode }

function applyThemeClass(preference: ReturnType<typeof useThemeStore.getState>['preference']) {
  const root = document.documentElement
  root.classList.remove('dark')

  if (preference === 'dark') {
    root.classList.add('dark')
    return
  }

  if (preference === 'system') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.classList.add('dark')
    }
  }
}

export function ThemeProvider({ children }: Props) {
  const preference = useThemeStore((s) => s.preference)

  useEffect(() => {
    applyThemeClass(preference)

    if (preference !== 'system') {
      return
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (useThemeStore.getState().preference === 'system') {
        applyThemeClass('system')
      }
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  return children
}
