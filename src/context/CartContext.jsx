/* eslint-disable react-refresh/only-export-components */
/**
 * CartContext.jsx
 * Contexto global para gestionar el carrito de compras.
 * Persiste los productos en localStorage y calcula los importes en tiempo real.
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { parsePrice } from '../utils/price';

const CartContext = createContext(null);
const LOCAL_STORAGE_KEY = 'audiogem_cart_items';

export const CartProvider = ({ children }) => {
    // Inicializar desde localStorage para persistencia
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error cargando el carrito desde localStorage:', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error guardando el carrito en localStorage:', error);
        }
    }, [cartItems]);

    /**
     * Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
     * Abre automáticamente el carrito para dar feedback inmediato al usuario.
     */
    const addToCart = useCallback((product, quantity = 1) => {
        if (!product || product.badge === 'Sin Stock') return;

        setCartItems((prevItems) => {
            const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
            if (existingIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    quantity: newItems[existingIndex].quantity + quantity,
                };
                return newItems;
            } else {
                return [...prevItems, { product, quantity }];
            }
        });

        // Feedback visual abriendo el drawer
        setIsCartOpen(true);
    }, []);

    /**
     * Elimina un producto por completo del carrito.
     */
    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
    }, []);

    /**
     * Actualiza la cantidad de un producto. Si es menor o igual a 0, lo elimina.
     */
    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    /**
     * Vacía el carrito por completo.
     */
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    /**
     * Alterna la visibilidad del drawer.
     */
    const toggleCart = useCallback(() => {
        setIsCartOpen((prev) => !prev);
    }, []);

    // Total de productos (ej. 2 estéreos + 1 subwoofer = 3 items)
    const cartItemsCount = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + item.quantity, 0);
    }, [cartItems]);

    // Sumatoria de precios en tiempo real
    const cartTotal = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const itemPrice = parsePrice(item.product.price);
            return acc + itemPrice * item.quantity;
        }, 0);
    }, [cartItems]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                isCartOpen,
                setIsCartOpen,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                toggleCart,
                cartItemsCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

/**
 * Hook personalizado para utilizar el carrito en cualquier componente.
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
