/**
 * FloatingWhatsApp.jsx
 * Botón flotante persistente para contacto directo por WhatsApp.
 */

import { FaWhatsapp } from 'react-icons/fa';
import './FloatingWhatsApp.css';
import { CART_CONFIG } from '../../constants/cartConfig';

const FloatingWhatsApp = () => {
    const phoneNumber = CART_CONFIG.whatsappNumber;
    const message = 'Hola AudioGem! Quiero realizar una consulta.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            className="whatsapp-float"
            target="_blank"
            rel="noreferrer"
            aria-label="Contactar por WhatsApp"
        >
            <div className="whatsapp-float__pulse" />
            <div className="whatsapp-float__icon">
                <FaWhatsapp />
            </div>
            <span className="whatsapp-float__tooltip">¿En qué podemos ayudarte?</span>
        </a>
    );
};

export default FloatingWhatsApp;
