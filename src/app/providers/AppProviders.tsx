import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

import { ThemeProvider } from '@/app/providers/ThemeProvider'

type Props = { children: ReactNode }

export function AppProviders({ children }: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>{children}</ThemeProvider>
    </MotionConfig>
  )
}
