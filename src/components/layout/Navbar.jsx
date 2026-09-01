/**
 * Navbar.jsx
 * Barra de navegación principal.
 * - Cabezal superior clásico con Logo y acciones (Admin, Carrito, CTA)
 * - Isla de navegación flotante (Pill) con efecto Glassmorphism
 * - Burbuja circular activa con deslizamiento animado por Framer Motion (layoutId)
 * - Posicionamiento ergonómico: Superior en Desktop, Inferior en Mobile
 */

import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { FiHome, FiShoppingBag, FiUsers, FiMail, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NAV_LINKS = [
    { to: '/', label: 'Inicio', Icon: FiHome },
    { to: '/productos', label: 'Productos', Icon: FiShoppingBag },
    { to: '/nosotros', label: 'Nosotros', Icon: FiUsers },
    { to: '/contacto', label: 'Contacto', Icon: FiMail },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isAdmin } = useAdmin();
    const { toggleCart, cartItemsCount } = useCart();

    // Detecta scroll para agregar sombra y cambiar estilo del header superior
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Header clásico superior (Logo + Acciones) */}
            <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
                <div className="navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="navbar__logo-text">
                            AUDIO<span className="navbar__logo-accent">GEM</span>
                        </span>
                    </Link>

                    {/* Acciones (Presupuestos si admin, Carrito, CTA) */}
                    <div className="navbar__actions">

                        {isAdmin && (
                            <Link
                                to="/admin/presupuestos"
                                className="navbar__admin-link"
                                aria-label="Crear presupuestos"
                                title="Crear presupuestos"
                            >
                                <span className="navbar__admin-link-icon"><FiFileText /></span>
                                <span className="navbar__admin-link-label">Presupuestos</span>
                            </Link>
                        )}

                        <button
                            className="navbar__cart-btn"
                            onClick={toggleCart}
                            aria-label="Abrir carrito de compras"
                            title="Ver mi carrito"
                        >
                            <span className="navbar__cart-icon"><FaShoppingCart /></span>
                            {cartItemsCount > 0 && (
                                <span className="navbar__cart-badge">{cartItemsCount}</span>
                            )}
                        </button>

                        <Link to="/contacto" className="navbar__cta">
                            Consultanos
                        </Link>
                    </div>
                </div>
            </header>

            {/* Isla flotante de navegación (Pill flotante) */}
            <nav className="nav-pill" aria-label="Navegación principal flotante">
                <div className="nav-pill__container">
                    {NAV_LINKS.map(({ to, label, Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className="nav-pill__link"
                        >
                            {({ isActive }) => (
                                <div className="nav-pill__item-wrapper">
                                    {/* Indicador activo deslizante (Shared Layout Animation) */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-bubble"
                                            className="nav-pill__active-bg"
                                            transition={{
                                                type: "spring",
                                                stiffness: 380,
                                                damping: 30,
                                                mass: 0.9
                                            }}
                                        />
                                    )}
                                    <span className={`nav-pill__icon ${isActive ? 'nav-pill__icon--active' : ''}`}>
                                        <Icon />
                                    </span>
                                    {/* Tooltip flotante */}
                                    <span className="nav-pill__tooltip">{label}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
