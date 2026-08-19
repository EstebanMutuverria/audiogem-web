/**
 * whatsapp.js
 * Utilidades para la generación de enlaces de WhatsApp.
 */

import { CART_CONFIG } from '../constants/cartConfig';

/**
 * Construye la URL de consulta de un producto por WhatsApp.
 * @param {Object} product - Objeto de producto de productsData.js
 * @returns {string} La URL completa de WhatsApp con el mensaje codificado.
 */
export const buildWhatsAppProductUrl = (product) => {
    const imageUrl = product.image
        ? (product.image.startsWith('data:') ? '' : `${window.location.origin}${product.image}`)
        : '';
    const message = `Hola AudioGem! Te queria consultar acerca del producto: ${product.name}${imageUrl ? ` - Imagen🔗: ${imageUrl}` : ''}`;
    return `https://wa.me/${CART_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
};
