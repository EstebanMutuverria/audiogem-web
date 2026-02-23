/**
 * ContactForm.jsx
 * Formulario de contacto con validación y manejo de estados.
 */

import { useContactForm } from '../../hooks/useContactForm';
import Button from '../../components/ui/Button';
import './ContactForm.css';

const ContactForm = () => {
    const { fields, errors, status, handleChange, handleSubmit, resetStatus } = useContactForm();

    if (status === 'success') {
        return (
            <div className="contact-form-box">
                <div className="form-success-msg">
                    <span className="form-success-icon">✅</span>
                    <h3 className="form-success-title">Mensaje enviado</h3>
                    <p className="form-success-text">
                        Gracias por contactarnos. Te responderemos a la brevedad.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetStatus}
                        style={{ marginTop: 'var(--spacing-6)' }}
                    >
                        Enviar otro mensaje
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="contact-form-box animate-fadeIn">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Nombre completo</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                        placeholder="Ej: Juan Pérez"
                        value={fields.name}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                        placeholder="juan@ejemplo.com"
                        value={fields.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="phone">Teléfono (opcional)</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                        placeholder="+54 9 11 0000-0000"
                        value={fields.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="message">Tu mensaje</label>
                    <textarea
                        id="message"
                        name="message"
                        className={`form-textarea ${errors.message ? 'form-textarea--error' : ''}`}
                        placeholder="¿En qué podemos ayudarte?"
                        value={fields.message}
                        onChange={handleChange}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                </div>

                {status === 'error' && (
                    <div className="form-error-banner animate-fadeIn">
                        ❌ Hubo un problema al enviar el mensaje. Por favor, intenta nuevamente.
                    </div>
                )}

                <Button
                    type="submit"
                    size="lg"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Enviando...' : 'Enviar consulta'}
                </Button>
            </form>
        </div>
    );
};

export default ContactForm;
