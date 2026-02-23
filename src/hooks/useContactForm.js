/**
 * useContactForm.js
 * Custom hook que encapsula toda la lógica del formulario de contacto.
 * El componente ContactForm solo maneja el JSX, la lógica vive aquí.
 */

import { useState } from 'react';
import { validateContactForm } from '../utils/validators';

const INITIAL_FIELDS = {
    name: '',
    email: '',
    phone: '',
    message: '',
};

export const useContactForm = () => {
    const [fields, setFields] = useState(INITIAL_FIELDS);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'

    /**
     * Actualiza el campo correspondiente al input que disparó el evento.
     * Limpia el error de ese campo al escribir.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
        // Clear error on typing
        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    /**
     * Valida y "envía" el formulario.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateContactForm(fields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('loading');
        setErrors({});

        try {
            const response = await fetch('https://formspree.io/f/xwvnwkzq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(fields),
            });

            if (response.ok) {
                console.log('📧 Formulario enviado a Formspree:', fields);
                setStatus('success');
                setFields(INITIAL_FIELDS);
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    setErrors(data.errors.reduce((acc, err) => ({
                        ...acc,
                        [err.field]: err.message
                    }), {}));
                }
                setStatus('error');
            }
        } catch (error) {
            console.error('❌ Error enviando formulario:', error);
            setStatus('error');
        }
    };

    const resetStatus = () => setStatus('idle');

    return {
        fields,
        errors,
        status,
        handleChange,
        handleSubmit,
        resetStatus,
    };
};
