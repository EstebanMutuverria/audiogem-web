/**
 * ContactInfo.jsx
 * Información de contacto de la tienda.
 */

import './ContactInfo.css';

const CONTACT_ITEMS = [
    {
        icon: '📍',
        label: 'Ubicación',
        value: 'Federico Lacroze 27, Don Torcuato, Buenos Aires, Argentina',
    },
    {
        icon: '📞',
        label: 'Teléfono / WhatsApp',
        value: '+54 011 6008-1534',
    },
    {
        icon: '✉️',
        label: 'Email',
        value: 'audiogem2025@gmail.com',
    },
    {
        icon: '🕐',
        label: 'Horario de atención',
        value: '24hs',
    },
];

const ContactInfo = () => (
    <aside className="contact-info animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        {CONTACT_ITEMS.map((item) => (
            <div key={item.label} className="contact-info__item">
                <div className="contact-info__icon">{item.icon}</div>
                <div className="contact-info__content">
                    <span className="contact-info__label">{item.label}</span>
                    <p className="contact-info__value">{item.value}</p>
                </div>
            </div>
        ))}

        <div className="contact-info__map" aria-hidden="true">
            <iframe className='contact-info__content' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.42669221093!2d-58.65954312515326!3d-34.49206535160864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bca35202bc3969%3A0xe8543c66795e5061!2sFederico%20Lacroze%2027%2C%20B1611DWC%20Don%20Torcuato%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1771796693588!5m2!1ses!2sar"></iframe>
        </div>
    </aside>
);

export default ContactInfo;
