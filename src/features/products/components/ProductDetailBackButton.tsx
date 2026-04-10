import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/cn'
import { ROUTES } from '@/lib/routes'
import { buttonStyles } from '@/ui/button-styles'

export type ProductDetailBackButtonProps = {
  className?: string
}

export function ProductDetailBackButton({ className }: ProductDetailBackButtonProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          navigate(-1)
        } else {
          navigate(ROUTES.home)
        }
      }}
      className={cn(buttonStyles({ variant: 'outline', size: 'sm' }), className)}
      aria-label="Voltar à página anterior"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
      Voltar
    </button>
  )
}
