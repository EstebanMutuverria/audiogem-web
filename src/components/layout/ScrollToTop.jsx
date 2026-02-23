/**
 * ScrollToTop.jsx
 * Hace scroll al inicio de la página en cada cambio de ruta.
 * No renderiza nada visible.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
