/**
 * validators.js
 * Funciones puras de validación para el formulario de contacto.
 * Sin side effects. Fácilmente testeables con Jest/Vitest.
 */

/**
 * Valida todos los campos del formulario de contacto.
 * @param {Object} fields - Los valores del formulario
 * @returns {Object} errors - Objeto con errores por campo (vacío = sin errores)
 */
export const validateContactForm = (fields) => {
    const errors = {};

    // Nombre
    if (!fields.name || fields.name.trim().length < 2) {
        errors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email || !emailRegex.test(fields.email)) {
        errors.email = 'Ingresá un correo electrónico válido.';
    }

    // Teléfono (opcional pero validado si se completa)
    if (fields.phone && fields.phone.trim().length > 0) {
        const phoneRegex = /^[\d\s\-+()]{7,15}$/;
        if (!phoneRegex.test(fields.phone)) {
            errors.phone = 'El teléfono ingresado no es válido.';
        }
    }

    // Mensaje
    if (!fields.message || fields.message.trim().length < 10) {
        errors.message = 'El mensaje debe tener al menos 10 caracteres.';
    }

    return errors;
};

/**
 * Verifica si un email tiene formato válido.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
