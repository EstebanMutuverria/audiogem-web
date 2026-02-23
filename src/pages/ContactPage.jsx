/**
 * ContactPage.jsx
 * Página de contacto con formulario e información de la tienda.
 */

import ContactForm from '../features/contact/ContactForm';
import ContactInfo from '../features/contact/ContactInfo';
import './ContactPage.css';

const ContactPage = () => {
    return (
        <div className="container section">
            <div className="section-header">
                <span className="section-label">Contacto</span>
                <h1 className="section-title">Estamos para ayudarte</h1>
                <p className="section-subtitle">
                    ¿Tenés dudas sobre qué equipo instalar? ¿Necesitás un presupuesto personalizado?
                    Escribinos y nos pondremos en contacto con vos.
                </p>
            </div>

            <div className="contact-grid">
                <ContactForm />
                <ContactInfo />
            </div>
        </div>
    );
};

export default ContactPage;
