/**
 * useOrder.js
 * Hook local de estado para construir pedidos de compra a proveedor.
 * Sigue el patrón de useCombo/useBudget pero enfocado en costos: cada item
 * guarda su costo unitario (unitCost) y puede venir del catálogo
 * (manual: false) o cargarse a mano (manual: true, con uid propio).
 */

import { useCallback, useMemo, useState } from 'react';
import { parsePrice } from '../../../utils/price';

/**
 * Gestiona los line items de un pedido junto con el proveedor, el total de
 * costo derivado y el flag de vacío.
 * @returns {Object} Estado del pedido y acciones para modificarlo.
 */
export const useOrder = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [supplierName, setSupplierName] = useState('');

    /**
     * Agrega un producto del catálogo al pedido. Si ya existe un item con ese
     * productId, incrementa su cantidad; en caso contrario lo agrega como un
     * item nuevo con costo unitario = base_price del producto.
     * @param {Object} product - Producto del catálogo (con campo `id`).
     */
    const addCatalogItem = useCallback((product) => {
        if (!product) return;

        setOrderItems((prevItems) => {
            const existingIndex = prevItems.findIndex(
                (item) => item.productId === product.id
            );
            if (existingIndex > -1) {
                return prevItems.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prevItems,
                {
                    uid: product.id,
                    productId: product.id,
                    name: product.name,
                    unitCost: parsePrice(product.base_price),
                    quantity: 1,
                    manual: false,
                },
            ];
        });
    }, []);

    /**
     * Agrega un producto cargado a mano. Siempre crea una fila nueva
     * (no dedupea) con un uid propio generado por crypto.randomUUID().
     * @param {string} name - Nombre del producto.
     * @param {string} priceStr - Precio de costo ingresado (string).
     */
    const addManualItem = useCallback((name, priceStr) => {
        if (!name || !name.trim()) return;

        setOrderItems((prevItems) => [
            ...prevItems,
            {
                uid: crypto.randomUUID(),
                productId: null,
                name: name.trim(),
                unitCost: parsePrice(priceStr),
                quantity: 1,
                manual: true,
            },
        ]);
    }, []);

    /**
     * Elimina un item del pedido por su uid.
     * @param {string|number} uid - Clave estable del item.
     */
    const removeItem = useCallback((uid) => {
        setOrderItems((prevItems) => prevItems.filter((item) => item.uid !== uid));
    }, []);

    /**
     * Actualiza la cantidad de un item. Si la cantidad es <= 0, elimina el item.
     * @param {string|number} uid - Clave estable del item.
     * @param {number} quantity - Nueva cantidad.
     */
    const updateQuantity = useCallback(
        (uid, quantity) => {
            if (quantity <= 0) {
                removeItem(uid);
                return;
            }

            setOrderItems((prevItems) =>
                prevItems.map((item) =>
                    item.uid === uid ? { ...item, quantity } : item
                )
            );
        },
        [removeItem]
    );

    /**
     * Vacía el pedido por completo (items y proveedor).
     */
    const clearOrder = useCallback(() => {
        setOrderItems([]);
        setSupplierName('');
    }, []);

    // Total de costo: suma de unitCost * quantity por item.
    const totalBaseCost = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + item.unitCost * item.quantity, 0);
    }, [orderItems]);

    const isEmpty = orderItems.length === 0;

    return {
        orderItems,
        supplierName,
        setSupplierName,
        totalBaseCost,
        isEmpty,
        addCatalogItem,
        addManualItem,
        removeItem,
        updateQuantity,
        clearOrder,
    };
};

export default useOrder;