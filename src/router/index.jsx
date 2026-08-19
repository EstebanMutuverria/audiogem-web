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

// Lazy loading de páginas
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));

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
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
]);

export default router;
