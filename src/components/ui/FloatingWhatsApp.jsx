/**
 * FloatingWhatsApp.jsx
 * Botón flotante persistente para contacto directo por WhatsApp.
 */

import { FaWhatsapp } from 'react-icons/fa';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
    const phoneNumber = '5491160081534';
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
