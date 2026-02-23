/**
 * Footer.jsx
 * Footer principal de la aplicación.
 */

import { Link } from 'react-router-dom';
import './Footer.css';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const QUICK_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
];

const PRODUCT_LINKS = [
    { label: 'Estéreos' },
    { label: 'Parlantes' },
    { label: 'Subwoofers' },
    { label: 'Potencias' },
    { label: 'Accesorios' },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__grid">
                    {/* Columna 1: Marca */}
                    <div>
                        <div className="footer__brand-logo">
                            AUDIO<span>GEM</span>
                        </div>
                        <p className="footer__brand-tagline">
                            Especialistas en audio vehicular de alta fidelidad.
                            Transformamos tu experiencia de manejo con el mejor sonido.
                        </p>
                        <div className="footer__social">
                            <a
                                href="https://www.instagram.com/audio_gem/"
                                target="_blank"
                                rel="noreferrer"
                                className="footer__social-link"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="/"
                                target="_self"
                                rel="noreferrer"
                                className="footer__social-link"
                                aria-label="Facebook"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href="https://wa.me/1160081534"
                                target="_blank"
                                rel="noreferrer"
                                className="footer__social-link"
                                aria-label="WhatsApp"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Navegación */}
                    <div>
                        <h3 className="footer__col-title">Navegación</h3>
                        <ul className="footer__links">
                            {QUICK_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className="footer__link">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Productos */}
                    <div>
                        <h3 className="footer__col-title">Productos</h3>
                        <ul className="footer__links">
                            {PRODUCT_LINKS.map(({ label }) => (
                                <li key={label}>
                                    <Link to="/productos" className="footer__link">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h3 className="footer__col-title">Contacto</h3>
                        <ul className="footer__contact-list">
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">📍</span>
                                <span>Federico Lacroze 27, Don Torcuato, Buenos Aires, Argentina</span>
                            </li>
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">📞</span>
                                <div className="footer__contact-phone">
                                    <span>+54 9 11 6008-1534</span>
                                    <span>+54 9 11 6996-6209</span>
                                </div>
                            </li>
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">✉️</span>
                                <span>audiogem2025@gmail.com</span>
                            </li>
                            <li className="footer__contact-item">
                                <span className="footer__contact-icon">🕐</span>
                                <span>24hs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © {year} AudioGem. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
