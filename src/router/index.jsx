/**
 * router/index.jsx
 * Configuración centralizada de React Router v7.
 * Implementa Lazy Loading para optimizar el bundle de producción.
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '../layouts/RootLayout';
import PageLoader from '../components/ui/PageLoader';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import AdminPage from '../pages/Admin/AdminPage';
import AdminRoute from '../components/admin/AdminRoute';

// Lazy loading de páginas
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const BudgetBuilder = lazy(() => import('../pages/Admin/views/BudgetBuilder/BudgetBuilder'));
const ComboBuilder = lazy(() => import('../pages/Admin/views/ComboBuilder/ComboBuilder'));
const AdminLoginPage = lazy(() => import('../pages/Admin/AdminLoginPage'));

// Helper para envolver páginas con Suspense
const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: withSuspense(HomePage),
            },
            {
                path: 'productos',
                element: withSuspense(ProductsPage),
            },
            {
                path: 'nosotros',
                element: withSuspense(AboutPage),
            },
            {
                path: 'contacto',
                element: withSuspense(ContactPage),
            },
            {
                path: 'admin',
                element: <AdminLoginPage />,
            },
            {
                path: 'admin/presupuestos',
                element: <AdminPage />,
                children: [
                    {
                        index: true,
                        element: withSuspense(() => (
                            <AdminRoute>
                                <BudgetBuilder />
                            </AdminRoute>
                        )),
                    },
                ],
            },
            {
                path: 'admin/combos',
                element: <AdminPage />,
                children: [
                    {
                        index: true,
                        element: withSuspense(() => (
                            <AdminRoute>
                                <ComboBuilder />
                            </AdminRoute>
                        )),
                    },
                ],
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;
