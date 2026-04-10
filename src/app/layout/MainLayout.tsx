import { useEffect, useState } from 'react'
import { Heart, LogOut, Menu, ShoppingCart } from 'lucide-react'
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { useCart } from '@/features/cart/hooks/useCart'
import { useFavoritesStore } from '@/features/products/stores/favorites-store'
import { ROUTES } from '@/lib/routes'
import { NavBadgeCount } from '@/app/layout/NavBadgeCount'

import { MobileNavDrawer } from './MobileNavDrawer'
import { ThemeToggle } from './ThemeToggle'

export function MainLayout() {
  const { itemCount } = useCart()
  const favoriteCount = useFavoritesStore((s) => s.ids.length)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isAdmin = location.pathname.startsWith('/admin')
  const outletKey = `${location.pathname}${location.search}|${location.key}`

  useEffect(() => {
    setMenuOpen(false)
  }, [location.key, location.pathname])

  return (
    <div className="shell">
      <a href="#conteudo-principal" className="skip-to-content">
        Pular para o conteúdo
      </a>
      <ScrollRestoration />
      {!isAdmin ? (
        <MobileNavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      ) : null}
      <div className="shell__header-mobile-group md:contents">
        <header className="shell__header">
          <div className="shell__header-inner flex min-w-0 w-full flex-nowrap items-center justify-between gap-2 md:flex-wrap md:items-center md:gap-4">
            {isAdmin ? (
              <>
                <Link
                  to={ROUTES.admin}
                  className="shell__brand min-w-0 shrink-0 max-md:leading-none md:shrink"
                >
                  <span className="shell__brand-mark hidden md:block">Admin</span>
                  <span className="shell__brand-accent hidden md:block" aria-hidden />
                  Styleware
                </Link>
                <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-auto">
                  <ThemeToggle variant="binary" />
                  <Link
                    to={ROUTES.home}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Sair do admin e ir ao catálogo"
                  >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                    Sair
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex min-w-0 max-md:flex-1 max-md:min-w-0 items-center gap-2 md:min-w-0 md:shrink">
                  <button
                    type="button"
                    className="shell__icon-btn shrink-0 md:hidden"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-drawer"
                    aria-label="Abrir menu"
                    onClick={() => setMenuOpen(true)}
                  >
                    <Menu className="h-4 w-4 md:h-[1.35rem] md:w-[1.35rem]" strokeWidth={2} />
                  </button>
                  <Link
                    to={ROUTES.home}
                    className="shell__brand min-w-0 max-md:leading-none md:shrink"
                  >
                    <span className="shell__brand-mark hidden md:block">Moda & varejo</span>
                    <span className="shell__brand-accent hidden md:block" aria-hidden />
                    Styleware
                  </Link>
                </div>

                <div className="flex shrink-0 items-center justify-center gap-0 md:hidden">
                  <Link
                    to={ROUTES.favorites}
                    className="shell__icon-btn shell__icon-btn--badged"
                    aria-label={
                      favoriteCount > 0
                        ? `Favoritos, ${favoriteCount} itens`
                        : 'Favoritos'
                    }
                  >
                    <Heart className="h-4 w-4 md:h-[1.35rem] md:w-[1.35rem]" strokeWidth={2} />
                    <NavBadgeCount
                      count={favoriteCount}
                      className="shell__badge shell__badge--icon"
                    />
                  </Link>
                  <Link
                    to={ROUTES.cart}
                    className="shell__icon-btn shell__icon-btn--badged"
                    aria-label={
                      itemCount > 0 ? `Carrinho, ${itemCount} itens` : 'Carrinho'
                    }
                  >
                    <ShoppingCart className="h-4 w-4 md:h-[1.35rem] md:w-[1.35rem]" strokeWidth={2} />
                    <NavBadgeCount count={itemCount} className="shell__badge shell__badge--icon" />
                  </Link>
                </div>

                <div className="shell__header-actions hidden md:flex">
                  <nav className="shell__nav flex" aria-label="Principal">
                    <div className="shell__nav-rail">
                      <Link to={ROUTES.home} className="shell__nav-link">
                        Produtos
                      </Link>
                      <Link
                        to={ROUTES.favorites}
                        className="shell__nav-link shell__nav-link--badged"
                        aria-label={
                          favoriteCount > 0
                            ? `Favoritos, ${favoriteCount} itens`
                            : 'Favoritos'
                        }
                      >
                        Favoritos
                        <NavBadgeCount count={favoriteCount} className="shell__badge" />
                      </Link>
                      <Link
                        to={ROUTES.cart}
                        className="shell__nav-link shell__nav-link--badged"
                        aria-label={
                          itemCount > 0 ? `Carrinho, ${itemCount} itens` : 'Carrinho'
                        }
                      >
                        Carrinho
                        <NavBadgeCount count={itemCount} className="shell__badge" />
                      </Link>
                    </div>
                    <div className="shell__nav-theme">
                      <ThemeToggle />
                    </div>
                  </nav>
                </div>
              </>
            )}
          </div>
          <div className="shell__header-glow" aria-hidden />
        </header>
      </div>
      <main id="conteudo-principal" className="shell__main" tabIndex={-1}>
        <div className="shell__main-inner">
          {/* Sem Framer no Outlet: AnimatePresence/motion deixava opacidade 0 em algumas navegações (ex.: PDP → início). */}
          <div key={outletKey} className="w-full min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="shell__footer">
        <div className="shell__footer-inner">
          <div className="shell__footer-brand">
            <p className="shell__footer-logo">Styleware</p>
            <p className="shell__footer-tagline muted">
              Vitrine de moda com condição comercial clara (novo, usado ou excelente estado),
              experiência mobile-first e checkout preparado para escalar.
            </p>
          </div>
          <div className="shell__footer-col shell__footer-col--nav">
            <p className="shell__footer-heading" id="footer-nav-heading">
              Navegar
            </p>
            <nav
              className="shell__footer-nav"
              aria-labelledby="footer-nav-heading"
            >
              <Link to={ROUTES.home}>Catálogo</Link>
              <Link to={ROUTES.favorites}>Favoritos</Link>
              <Link to={ROUTES.cart}>Carrinho</Link>
              <Link to={ROUTES.admin}>Admin · cadastro</Link>
            </nav>
          </div>
          <div className="shell__footer-col shell__footer-col--trust">
            <p className="shell__footer-heading">Confiança</p>
            <p className="shell__footer-trust muted">
              Ambiente seguro · Privacidade e checkout preparados para escala.
            </p>
          </div>
        </div>
        <p className="shell__footer-meta muted">
          © {new Date().getFullYear()} Styleware · Vitrine técnica
        </p>
      </footer>
    </div>
  )
}
