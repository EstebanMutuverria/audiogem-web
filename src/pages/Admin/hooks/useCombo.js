/**
 * useCombo.js
 * Hook local de estado para construir combos de administración.
 * Sigue el patrón de useBudget pero agrega campos de nombre, descuento
 * ingresado a mano, y derivaciones de dual pricing (venta + base).
 * El precio final del combo se calcula como: venta total - descuento.
 */

import { useCallback, useMemo, useState } from 'react';
import { parsePrice } from '../../../utils/price';

/**
 * Gestiona los line items de un combo junto con precios derivados y validación.
 * @returns {Object} Estado del combo y acciones para modificarlo.
 */
export const useCombo = () => {
    const [comboItems, setComboItems] = useState([]);
    const [comboName, setComboName] = useState('');
    const [discount, setDiscount] = useState('');

    /**
     * Agrega un producto al combo. Si ya existe, incrementa su cantidad.
     * @param {Object} product - Producto del catálogo (con campo `id`).
     */
    const addItem = useCallback((product) => {
        if (!product) return;

        setComboItems((prevItems) => {
            const existingIndex = prevItems.findIndex(
                (item) => item.product.id === product.id
            );
            if (existingIndex > -1) {
                return prevItems.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { product, quantity: 1, uid: product.id }];
        });
    }, []);

    /**
     * Agrega un producto cargado a mano. Siempre crea una fila nueva
     * (no dedupea) con un uid propio generado por crypto.randomUUID().
     * El precio cargado es el de venta; su costo/base queda en $0.
     * @param {string} name - Nombre del producto.
     * @param {string} priceStr - Precio de venta ingresado (string).
     */
    const addManualItem = useCallback((name, priceStr) => {
        if (!name || !name.trim()) return;

        setComboItems((prevItems) => [
            ...prevItems,
            {
                uid: crypto.randomUUID(),
                manual: true,
                name: name.trim(),
                price: priceStr.trim(),
                quantity: 1,
            },
        ]);
    }, []);

    /**
     * Elimina un item del combo por su uid.
     * @param {string|number} uid - Clave estable del item (product.id o UUID).
     */
    const removeItem = useCallback((uid) => {
        setComboItems((prevItems) =>
            prevItems.filter((item) => item.uid !== uid)
        );
    }, []);

    /**
     * Actualiza la cantidad de un item. Si la cantidad es <= 0, elimina el item.
     * @param {string|number} uid - Clave estable del item (product.id o UUID).
     * @param {number} quantity - Nueva cantidad.
     */
    const updateQuantity = useCallback(
        (uid, quantity) => {
            if (quantity <= 0) {
                removeItem(uid);
                return;
            }

            setComboItems((prevItems) =>
                prevItems.map((item) =>
                    item.uid === uid ? { ...item, quantity } : item
                )
            );
        },
        [removeItem]
    );

    /**
     * Vacía el combo por completo.
     */
    const clearCombo = useCallback(() => {
        setComboItems([]);
        setComboName('');
        setDiscount('');
    }, []);

    // Total de venta: parsePrice(product.price) * quantity por item.
    // Los items manuales suman su precio cargado a mano; su base es $0.
    const totalSalePrice = useMemo(() => {
        return comboItems.reduce((acc, item) => {
            const itemPrice = item.manual
                ? parsePrice(item.price)
                : parsePrice(item.product.price);
            return acc + itemPrice * item.quantity;
        }, 0);
    }, [comboItems]);

    // Total base: parsePrice(product.base_price) * quantity por item.
    // Si base_price es null o "", su contribución es 0. Los items manuales
    // no tienen costo base cargado: contribuyen 0.
    const totalBasePrice = useMemo(() => {
        return comboItems.reduce((acc, item) => {
            if (item.manual) return acc;
            const basePrice = parsePrice(item.product.base_price);
            return acc + basePrice * item.quantity;
        }, 0);
    }, [comboItems]);

    // Descuento máximo posible entre venta y base.
    const maxDiscount = totalSalePrice - totalBasePrice;

    // Descuento ingresado a mano, parseado a número.
    const parsedDiscount =
        discount && discount.trim() !== '' ? parsePrice(discount) : 0;

    // Precio final del combo: se calcula solo como venta total - descuento.
    const comboPrice = totalSalePrice - parsedDiscount;

    // Validación: el descuento no puede superar el descuento máximo
    // (venta - base) para no vender por debajo del costo y perder dinero.
    const isDiscountValid = useMemo(() => {
        const parsed = parsePrice(discount || 0);
        return parsed >= 0 && parsed <= maxDiscount;
    }, [discount, maxDiscount]);

    const isEmpty = comboItems.length === 0;

    return {
        comboItems,
        comboName,
        discount,
        comboPrice,
        totalSalePrice,
        totalBasePrice,
        maxDiscount,
        isDiscountValid,
        isEmpty,
        addItem,
        addManualItem,
        removeItem,
        updateQuantity,
        setComboName,
        setDiscount,
        clearCombo,
    };
};

export default useCombo;
