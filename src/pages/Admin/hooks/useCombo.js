/**
 * useCombo.js
 * Hook local de estado para construir combos de administración.
 * Sigue el patrón de useBudget pero agrega campos de nombre, precio combo,
 * y derivaciones de dual pricing (venta + base).
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
    const [comboPrice, setComboPrice] = useState('');

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
            return [...prevItems, { product, quantity: 1 }];
        });
    }, []);

    /**
     * Elimina un producto por completo del combo.
     * @param {number} productId - ID del producto a eliminar.
     */
    const removeItem = useCallback((productId) => {
        setComboItems((prevItems) =>
            prevItems.filter((item) => item.product.id !== productId)
        );
    }, []);

    /**
     * Actualiza la cantidad de un producto. Si la cantidad es <= 0, elimina el item.
     * @param {number} productId - ID del producto.
     * @param {number} quantity - Nueva cantidad.
     */
    const updateQuantity = useCallback(
        (productId, quantity) => {
            if (quantity <= 0) {
                removeItem(productId);
                return;
            }

            setComboItems((prevItems) =>
                prevItems.map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity }
                        : item
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
        setComboPrice('');
    }, []);

    // Total de venta: parsePrice(product.price) * quantity por item.
    const totalSalePrice = useMemo(() => {
        return comboItems.reduce((acc, item) => {
            const itemPrice = parsePrice(item.product.price);
            return acc + itemPrice * item.quantity;
        }, 0);
    }, [comboItems]);

    // Total base: parsePrice(product.base_price) * quantity por item.
    // Si base_price es null o "", su contribución es 0.
    const totalBasePrice = useMemo(() => {
        return comboItems.reduce((acc, item) => {
            const basePrice = parsePrice(item.product.base_price);
            return acc + basePrice * item.quantity;
        }, 0);
    }, [comboItems]);

    // Descuento máximo posible entre venta y base.
    const maxDiscount = totalSalePrice - totalBasePrice;

    // Validación: comboPrice debe estar entre totalBasePrice y totalSalePrice.
    const isPriceValid = useMemo(() => {
        if (!comboPrice || comboPrice.trim() === '') return false;
        const price = parsePrice(comboPrice);
        return price >= totalBasePrice && price <= totalSalePrice;
    }, [comboPrice, totalBasePrice, totalSalePrice]);

    const isEmpty = comboItems.length === 0;

    return {
        comboItems,
        comboName,
        comboPrice,
        totalSalePrice,
        totalBasePrice,
        maxDiscount,
        isPriceValid,
        isEmpty,
        addItem,
        removeItem,
        updateQuantity,
        setComboName,
        setComboPrice,
        clearCombo,
    };
};

export default useCombo;
