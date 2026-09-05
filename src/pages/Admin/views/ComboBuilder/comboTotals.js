/**
 * comboTotals.js
 * Helpers puros para resolver los totales de un combo ya persistido.
 * Soporta ambos modelos de datos:
 * - Combos nuevos: guardan `discount` (el precio final se deriva).
 * - Combos viejos: guardan `comboPrice` directo (sin `discount`).
 */

import { ALL_PRODUCTS } from '../../../../services/productsData';
import { parsePrice } from '../../../../utils/price';

/**
 * Resuelve items, totales, descuento aplicado, precio final y ganancia neta
 * de un combo guardado, contra el catálogo actual.
 * @param {Object} combo - Combo persistido en localStorage.
 * @returns {{
 *   resolvedItems: Array,
 *   totalSale: number,
 *   totalBase: number,
 *   appliedDiscount: number,
 *   finalPrice: number,
 *   netProfit: number,
 * }}
 */
export function resolveComboTotals(combo) {
    let totalSale = 0;
    let totalBase = 0;

    const resolvedItems = combo.items.map((item) => {
        const product =
            ALL_PRODUCTS.find((p) => p.id === item.productId) || null;
        const saleUnit = product ? parsePrice(product.price) : 0;
        const baseUnit = product ? parsePrice(product.base_price) : 0;
        const saleSubtotal = saleUnit * item.quantity;
        const baseSubtotal = baseUnit * item.quantity;
        totalSale += saleSubtotal;
        totalBase += baseSubtotal;
        return {
            ...item,
            product,
            productName: product?.name || 'Producto no encontrado',
            saleUnit,
            baseUnit,
            saleSubtotal,
            baseSubtotal,
        };
    });

    const hasStoredDiscount =
        combo.discount !== undefined && combo.discount !== null;

    // Modelo nuevo: descuento guardado; precio final = venta - descuento.
    // Modelo viejo: precio final guardado; descuento = venta - precio final.
    const appliedDiscount = hasStoredDiscount
        ? combo.discount
        : totalSale - (combo.comboPrice || 0);
    const finalPrice = hasStoredDiscount
        ? totalSale - appliedDiscount
        : combo.comboPrice || 0;
    const netProfit = finalPrice - totalBase;

    return {
        resolvedItems,
        totalSale,
        totalBase,
        appliedDiscount,
        finalPrice,
        netProfit,
    };
}