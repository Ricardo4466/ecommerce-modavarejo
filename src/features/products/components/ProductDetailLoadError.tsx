import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/lib/routes'

type ProductDetailLoadErrorProps = {
  message: string
}

export function ProductDetailLoadError({ message }: ProductDetailLoadErrorProps) {
  return (
    <div className="mx-auto w-full max-w-lg py-16 text-center">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-lg font-semibold text-text-h" role="alert">
          {message}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Confira o endereço ou volte para a listagem.
        </p>
        <motion.div className="mt-6 inline-block" whileTap={{ scale: 0.98 }}>
          <Link
            to={ROUTES.home}
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-[background-color,transform] duration-200 hover:bg-secondary-200/80 dark:hover:bg-secondary-800/80"
          >
            Ver produtos
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
