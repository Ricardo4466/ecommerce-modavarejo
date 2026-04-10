import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { MainLayout } from '@/app/layout/MainLayout'
import { ROUTES } from '@/lib/routes'
import { ProductListingPage } from '@/features/products/pages/ProductListingPage'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'
import { FavoritesPage } from '@/features/products/pages/FavoritesPage'
import { CartPage } from '@/features/cart/pages/CartPage'
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage'
import { OrderConfirmationPage } from '@/features/checkout/pages/OrderConfirmationPage'
import { AdminProductListPage } from '@/features/admin/pages/AdminProductListPage'
import {
  AdminProductEditPage,
  AdminProductNewPage,
} from '@/features/admin/pages/AdminProductFormPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <ProductListingPage /> },
      { path: 'produto/:slug', element: <ProductDetailPage /> },
      { path: 'favoritos', element: <FavoritesPage /> },
      { path: 'carrinho', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'pedido/:orderId', element: <OrderConfirmationPage /> },
      { path: 'admin', element: <AdminProductListPage /> },
      { path: 'admin/novo', element: <AdminProductNewPage /> },
      { path: 'admin/editar/:id', element: <AdminProductEditPage /> },
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
