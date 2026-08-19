/**
 * RootLayout.jsx
 * Layout principal que envuelve a todas las páginas.
 * Contiene los elementos persistentes: Navbar, ScrollToTop y Footer.
 */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import FloatingWhatsApp from '../components/layout/FloatingWhatsApp';
import IntroAnimation from '../components/animations/IntroAnimation';
import CartDrawer from '../components/layout/CartDrawer';
import './RootLayout.css';
import ButtonToTop from '../components/layout/ButtonToTop';
import { useCart } from '../context/CartContext';

const RootLayout = () => {
    const { isCartOpen } = useCart();

    return (
        <>
            <IntroAnimation />
            <ScrollToTop />
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - var(--navbar-height))' }} className={isCartOpen ? 'disable-scroll' : ''}>
                <Outlet />
            </main>
            <CartDrawer />
            <FloatingWhatsApp />
            <ButtonToTop />
            <Footer />
        </>
    );
};

export default RootLayout;
