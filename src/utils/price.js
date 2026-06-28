/**
 * price.js
 * Utilidades para el parseo y formateo de precios en ARS (Pesos Argentinos).
 */

/**
 * Convierte un string de precio (ej: "$70.000") a un número entero.
 * @param {string} priceStr - El string del precio.
 * @returns {number} El precio como número entero.
 */
export const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    // Remueve todo lo que no sea un dígito numérico (ej: "$", ".")
    const cleanStr = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr, 10);
    return isNaN(num) ? 0 : num;
};

/**
 * Formatea un número entero a un string con formato ARS (ej: 70000 -> "$70.000").
 * @param {number} value - El valor numérico.
 * @returns {string} El precio formateado con el signo "$" y separadores de miles.
 */
export const formatPrice = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '$0';
    return `$${new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0 }).format(value)}`;
};
