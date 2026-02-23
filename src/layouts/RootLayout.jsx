/**
 * RootLayout.jsx
 * Layout principal que envuelve a todas las páginas.
 * Contiene los elementos persistentes: Navbar, ScrollToTop y Footer.
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import FloatingWhatsApp from '../components/ui/FloatingWhatsApp';

const RootLayout = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
                <Outlet />
            </main>
            <FloatingWhatsApp />
            <Footer />
        </>
    );
};

export default RootLayout;
