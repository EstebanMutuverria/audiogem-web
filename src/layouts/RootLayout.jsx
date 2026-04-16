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
import IntroAnimation from '../components/ui/IntroAnimation';
import PageTransition from '../components/layout/PageTransition';
import './RootLayout.css';
import ButtonToTop from '../components/ui/ButtonToTop';

const RootLayout = () => {
    return (
        <>
            <IntroAnimation />
            <ScrollToTop />
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
                <PageTransition />
            </main>
            <FloatingWhatsApp />
            <ButtonToTop />
            <Footer />
        </>
    );
};

export default RootLayout;
