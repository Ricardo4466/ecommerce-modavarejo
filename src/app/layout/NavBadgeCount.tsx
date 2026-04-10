import { AnimatePresence, motion } from 'framer-motion'

import { springBadge } from '@/lib/motion'

type NavBadgeCountProps = {
  count: number
  className?: string
}

/**
 * Contador animado para links de navegação (favoritos / carrinho).
 */
export function NavBadgeCount({ count, className }: NavBadgeCountProps) {
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.span
          key="nav-badge"
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.86 }}
          transition={springBadge}
          className={className}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      ) : null}
    </AnimatePresence>
  )
}
