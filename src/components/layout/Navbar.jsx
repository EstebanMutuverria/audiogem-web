/**
 * Navbar.jsx
 * Barra de navegación principal.
 * - Sticky con efecto glassmorphism al hacer scroll
 * - NavLink de React Router para estilo "active" automático
 * - Menú hamburguesa en móvil
 * - Botón "Soy Admin" para autenticar y ver precios base
 */

import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import AdminLoginModal from '../ui/AdminLoginModal';
import './Navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAdmin, logout } = useAdmin();

    // Detecta scroll para agregar sombra al navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    // Cierra el menú móvil al cambiar de ruta
    const closeMenu = () => setIsMenuOpen(false);

    const handleAdminClick = () => {
        if (isAdmin) {
            logout();
        } else {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
                <div className="navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo" onClick={closeMenu}>
                        <span className="navbar__logo-text">
                            AUDIO<span className="navbar__logo-accent">GEM</span>
                        </span>
                    </Link>

                    {/* Links desktop */}
                    <nav className="navbar__nav" aria-label="Navegación principal">
                        {NAV_LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                className={({ isActive }) =>
                                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Acciones desktop */}
                    <div className="navbar__actions">
                        <button
                            className={`navbar__admin-btn ${isAdmin ? 'navbar__admin-btn--active' : ''}`}
                            onClick={handleAdminClick}
                            aria-label={isAdmin ? 'Cerrar sesión de administrador' : 'Acceder como administrador'}
                            title={isAdmin ? 'Sesión admin activa — click para cerrar sesión' : 'Soy Admin'}
                        >
                            <span className="navbar__admin-btn-icon">{isAdmin ? '🔓' : '🔐'}</span>
                            <span className="navbar__admin-btn-label">
                                {isAdmin ? 'Cerrar sesion Admin' : 'Soy Admin'}
                            </span>
                        </button>

                        <Link to="/contacto" className="navbar__cta">
                            Consultanos
                        </Link>
                    </div>

                    {/* Hamburguesa móvil */}
                    <button
                        className={`navbar__hamburger ${isMenuOpen ? 'navbar__hamburger--open' : ''}`}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-label="Abrir menú"
                        aria-expanded={isMenuOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </header>

            {/* Overlay background */}
            <div
                className={`navbar__overlay ${isMenuOpen ? 'navbar__overlay--open' : ''}`}
                onClick={closeMenu}
            />

            {/* Menú móvil */}
            <nav
                className={`navbar__mobile-menu ${isMenuOpen ? 'navbar__mobile-menu--open' : ''}`}
                aria-label="Menú móvil"
            >
                <div className="navbar__mobile-header">
                    <span className="navbar__logo-text">
                        AUDIO<span className="navbar__logo-accent">GEM</span>
                    </span>
                    <button
                        className="navbar__mobile-close"
                        onClick={closeMenu}
                        aria-label="Cerrar menú"
                    >
                        ✕
                    </button>
                </div>

                <div className="navbar__mobile-content">
                    <div className="navbar__mobile-links">
                        {NAV_LINKS.map(({ to, label }, index) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                className={({ isActive }) =>
                                    `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                                }
                                onClick={closeMenu}
                                style={{ '--index': index }}
                            >
                                <span className="navbar__mobile-link-label">{label}</span>
                                <span className="navbar__mobile-link-arrow">→</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="navbar__mobile-footer">
                        <Link to="/contacto" className="navbar__mobile-cta" onClick={closeMenu}>
                            Consultanos ahora
                        </Link>

                        <button
                            className={`navbar__mobile-admin-btn ${isAdmin ? 'navbar__mobile-admin-btn--active' : ''}`}
                            onClick={() => {
                                closeMenu();
                                handleAdminClick();
                            }}
                        >
                            <span className="navbar__mobile-admin-icon">{isAdmin ? '🔓' : '🔐'}</span>
                            <span className="navbar__mobile-admin-text">
                                {isAdmin ? 'Panel Admin Activo' : 'Acceso Administrador'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Modal de autenticación */}
            <AdminLoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default Navbar;
