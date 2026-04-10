import { motion } from 'framer-motion'

import { useCart } from '@/features/cart/hooks/useCart'
import { PLP_GRID_CLASS } from '@/features/products/constants'
import { springSoft } from '@/lib/motion'
import type { Product } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { FavoriteButton } from '@/features/products/components/FavoriteButton'

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.042,
      delayChildren: 0.055,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
}

type Props = {
  products: Product[]
}

export function ProductListingGrid({ products }: Props) {
  const { addItem } = useCart()

  return (
    <motion.ul
      className={PLP_GRID_CLASS}
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((p) => (
        <motion.li key={p.id} variants={itemVariants} layout>
          <ProductCard
            product={p}
            topAction={<FavoriteButton productId={p.id} />}
            onAddToCart={addItem}
          />
        </motion.li>
      ))}
    </motion.ul>
  )
}
