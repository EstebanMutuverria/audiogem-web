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
import CartDrawer from '../components/layout/CartDrawer';
import './RootLayout.css';
import ButtonToTop from '../components/ui/ButtonToTop';
import { CartContext } from '../context/CartContext';

const RootLayout = () => {
    const { isCartOpen } = useContext(CartContext);

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
