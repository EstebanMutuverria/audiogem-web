/**
 * router/index.jsx
 * Configuración centralizada de React Router v6.
 * Implementa Lazy Loading para optimizar el bundle de producción.
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '../layouts/RootLayout';
import PageLoader from '../components/ui/PageLoader';

// Lazy loading de páginas
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

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
                path: '*',
                element: (
                    <div className="container section" style={{ textAlign: 'center' }}>
                        <h1>404</h1>
                        <p>Página no encontrada</p>
                    </div>
                ),
            },
        ],
    },
]);

export default router;
