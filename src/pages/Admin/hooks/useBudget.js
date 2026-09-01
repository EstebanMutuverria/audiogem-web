/**
 * useBudget.js
 * Hook local de estado para construir presupuestos de administración.
 * Independiente del carrito de clientes: no persiste y no acopla
 * la lógica de cotizaciones con el cart del usuario.
 */

import { useCallback, useMemo, useState } from 'react';
import { parsePrice } from '../../../utils/price';

/**
 * Gestiona los line items de un presupuesto junto con su total derivado.
 * @returns {{ lineItems: Array, budgetTotal: number, addItem: Function, updateQuantity: Function, removeItem: Function, clearBudget: Function, isEmpty: boolean }}
 */
export const useBudget = () => {
    const [lineItems, setLineItems] = useState([]);

    /**
     * Agrega un producto. Si ya existe en el presupuesto, incrementa su cantidad;
     * en caso contrario lo agrega como un nuevo line item con cantidad 1.
     */
    const addItem = useCallback((product) => {
        if (!product) return;

        setLineItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
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
     * Elimina un producto por completo del presupuesto.
     */
    const removeItem = useCallback((productId) => {
        setLineItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    }, []);

    /**
     * Actualiza la cantidad de un producto. Si la cantidad es menor o igual a 0,
     * elimina el line item.
     */
    const updateQuantity = useCallback(
        (productId, quantity) => {
            if (quantity <= 0) {
                removeItem(productId);
                return;
            }

            setLineItems((prevItems) =>
                prevItems.map((item) =>
                    item.product.id === productId ? { ...item, quantity } : item
                )
            );
        },
        [removeItem]
    );

    /**
     * Vacía el presupuesto por completo.
     */
    const clearBudget = useCallback(() => {
        setLineItems([]);
    }, []);

    // Suma de subtotales: parsePrice(price) * quantity por line item.
    const budgetTotal = useMemo(() => {
        return lineItems.reduce((acc, item) => {
            const itemPrice = parsePrice(item.product.price);
            return acc + itemPrice * item.quantity;
        }, 0);
    }, [lineItems]);

    const isEmpty = lineItems.length === 0;

    return {
        lineItems,
        budgetTotal,
        addItem,
        updateQuantity,
        removeItem,
        clearBudget,
        isEmpty,
    };
};

export default useBudget;
