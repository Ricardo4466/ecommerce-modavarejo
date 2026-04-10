import { motion } from 'framer-motion'
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

import { springButton } from '@/lib/motion'

import { buttonStyles, type ButtonSize, type ButtonVariant } from './button-styles'

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
  | 'onAnimationStart'
  | 'onAnimationEnd'
> & {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      type = 'button',
      disabled,
      ...rest
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        className={buttonStyles({ variant, size, className })}
        whileHover={disabled ? undefined : { scale: 1.008, y: -0.5 }}
        whileTap={disabled ? undefined : { scale: 0.992 }}
        transition={springButton}
        {...rest}
      >
        {children}
      </motion.button>
    )
  },
)
