import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/lib/routes'

import { X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

type Props = {
  open: boolean
  onClose: () => void
}

function DrawerNavLink({
  to,
  children,
  onNavigate,
}: {
  to: string
  children: ReactNode
  onNavigate: () => void
}) {
  return (
    <Link
      to={to}
      className="mobile-drawer__link"
      onClick={() => onNavigate()}
    >
      {children}
    </Link>
  )
}

export function MobileNavDrawer({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onDialogClose = () => onClose()
    el.addEventListener('close', onDialogClose)
    if (open && !el.open) {
      el.showModal()
      queueMicrotask(() => closeBtnRef.current?.focus())
    } else if (!open && el.open) {
      el.close()
    }
    return () => el.removeEventListener('close', onDialogClose)
  }, [open, onClose])

  return (
    <dialog
      id="mobile-drawer"
      ref={ref}
      className="mobile-drawer"
      aria-labelledby="mobile-drawer-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
    >
      <div
        className="mobile-drawer__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-drawer__head">
          <p id="mobile-drawer-title" className="mobile-drawer__title">
            Menu
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            className="shell__icon-btn"
            onClick={() => ref.current?.close()}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <nav className="mobile-drawer__nav" aria-label="Navegação principal">
          <DrawerNavLink to={ROUTES.home} onNavigate={onClose}>
            Catálogo
          </DrawerNavLink>
          <DrawerNavLink to={ROUTES.favorites} onNavigate={onClose}>
            Favoritos
          </DrawerNavLink>
          <DrawerNavLink to={ROUTES.cart} onNavigate={onClose}>
            Carrinho
          </DrawerNavLink>
        </nav>
        <div className="mobile-drawer__theme">
          <span className="mobile-drawer__theme-label">Aparência</span>
          <ThemeToggle appearance="minimal" />
        </div>
      </div>
    </dialog>
  )
}
