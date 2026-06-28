/**
 * CartDrawer.jsx
 * Panel lateral deslizable (slide-over drawer) para el carrito de compras.
 * Cuenta con efectos de glassmorphic y animaciones fluidas.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice, parsePrice } from '../../utils/price';
import { CART_CONFIG } from '../../constants/cartConfig';
import Button from '../ui/Button';
import './CartDrawer.css';
import { FaWhatsapp } from 'react-icons/fa';

const CartDrawer = () => {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemsCount,
    } = useCart();

    const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
    const navigate = useNavigate();

    // Bloquear el scroll del body cuando el carrito está abierto
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    const handleClose = () => {
        setIsCartOpen(false);
        setShowSuccessPrompt(false);
    };

    const handleEmptyCart = () => {
        clearCart();
        setShowSuccessPrompt(false);
        setIsCartOpen(false);
    };

    const handleKeepCart = () => {
        setShowSuccessPrompt(false);
    };

    const handleSendOrder = () => {
        if (cartItems.length === 0) return;

        // Construir mensaje de WhatsApp
        let message = `*Pedido de AudioGem* 🛒\n`;
        message += `--------------------------------\n`;
        message += `¡Hola! Me gustaría realizar el siguiente pedido:\n\n`;

        cartItems.forEach((item) => {
            const unitPriceVal = parsePrice(item.product.price);
            const subtotalVal = unitPriceVal * item.quantity;

            message += `• *${item.quantity}x* ${item.product.name}\n`;
            if (item.product.brand) {
                message += `  _Marca: ${item.product.brand}_\n`;
            }
            message += `  _Precio unitario: ${item.product.price}_\n`;
            message += `  _Subtotal: ${formatPrice(subtotalVal)}_\n\n`;
        });

        message += `--------------------------------\n`;
        message += `*Total del Pedido: ${formatPrice(cartTotal)}*\n`;
        message += `--------------------------------\n`;
        message += `Muchas gracias.`;

        // Generar URL y abrir en pestaña nueva
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CART_CONFIG.whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Mostrar prompt de confirmación para vaciar el carrito
        setShowSuccessPrompt(true);
    };

    const handleGoToProducts = () => {
        setIsCartOpen(false);
        navigate('/productos');
    };

    return (
        <>
            {/* Fondo opaco detrás del drawer */}
            <div
                className={`cart-overlay ${isCartOpen ? 'cart-overlay--open' : ''}`}
                onClick={handleClose}
            />

            {/* Panel lateral deslizable */}
            <aside className={`cart-drawer ${isCartOpen ? 'cart-drawer--open' : ''}`} aria-label="Carrito de compras">
                {/* Cabecera */}
                <div className="cart-drawer__header">
                    <div className="cart-drawer__header-title">
                        <h2>Tu Carrito</h2>
                        <span className="cart-drawer__count-badge">{cartItemsCount}</span>
                    </div>
                    <button
                        className="cart-drawer__close-btn"
                        onClick={handleClose}
                        aria-label="Cerrar carrito"
                    >
                        ✕
                    </button>
                </div>

                {/* Cuerpo principal */}
                <div className="cart-drawer__body">
                    {showSuccessPrompt ? (
                        /* Mensaje Post-Checkout (WhatsApp enviado) */
                        <div className="cart-drawer__success-prompt">
                            <span className="cart-drawer__success-icon">✅</span>
                            <h3>¡Pedido Enviado!</h3>
                            <p>
                                Abrimos WhatsApp en una nueva pestaña para que envíes la lista de productos.
                            </p>
                            <p className="cart-drawer__success-question">
                                ¿Querés vaciar tu carrito ahora?
                            </p>
                            <div className="cart-drawer__success-actions">
                                <Button
                                    variant="primary"
                                    onClick={handleEmptyCart}
                                    className="cart-drawer__success-btn"
                                >
                                    Sí, vaciar carrito
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleKeepCart}
                                    className="cart-drawer__success-btn-keep"
                                >
                                    No, conservar productos
                                </Button>
                            </div>
                        </div>
                    ) : cartItems.length === 0 ? (
                        /* Estado vacío */
                        <div className="cart-drawer__empty">
                            <span className="cart-drawer__empty-icon">🛒</span>
                            <h3>Tu carrito está vacío</h3>
                            <p>
                                Todavía no agregaste ningún producto a tu carrito. ¡Explorá nuestro catálogo y encontrá la mejor fidelidad de sonido vehicular!
                            </p>
                            <Button variant="primary" onClick={handleGoToProducts}>
                                Explorar Productos
                            </Button>
                        </div>
                    ) : (
                        /* Lista de productos */
                        <div className="cart-drawer__list">
                            {cartItems.map((item) => {
                                const { id, name, category, brand, image, price } = item.product;
                                const parsedVal = parsePrice(price);
                                const itemSubtotal = parsedVal * item.quantity;

                                return (
                                    <div key={id} className="cart-item">
                                        <div className="cart-item__image">
                                            {image ? (
                                                <img src={image} alt={name} />
                                            ) : (
                                                <span className="cart-item__placeholder">🎵</span>
                                            )}
                                        </div>

                                        <div className="cart-item__details">
                                            <span className="cart-item__category">{category}</span>
                                            <h4 className="cart-item__name">{name}</h4>
                                            {brand && <span className="cart-item__brand">Marca: {brand}</span>}
                                            <span className="cart-item__price-unit">
                                                {price} c/u
                                            </span>

                                            {/* Controles de cantidad e importe */}
                                            <div className="cart-item__actions">
                                                <div className="cart-item__qty-selector">
                                                    <button
                                                        onClick={() => updateQuantity(id, item.quantity - 1)}
                                                        className="cart-item__qty-btn"
                                                        aria-label="Restar uno"
                                                    >
                                                        –
                                                    </button>
                                                    <span className="cart-item__qty-value">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(id, item.quantity + 1)}
                                                        className="cart-item__qty-btn"
                                                        aria-label="Sumar uno"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className="cart-item__subtotal">
                                                    Subtotal: {formatPrice(itemSubtotal)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="cart-item__remove"
                                            onClick={() => removeFromCart(id)}
                                            aria-label={`Quitar ${name} del carrito`}
                                            title="Eliminar producto"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pie del Carrito (Resumen y Checkout) */}
                {cartItems.length > 0 && !showSuccessPrompt && (
                    <div className="cart-drawer__footer">
                        <div className="cart-drawer__summary">
                            <div className="cart-drawer__summary-row">
                                <span>Cantidad de productos:</span>
                                <span>{cartItemsCount}</span>
                            </div>
                            <div className="cart-drawer__summary-row cart-drawer__summary-row--total">
                                <span>Total a pagar:</span>
                                <span className="cart-drawer__total-amount">{formatPrice(cartTotal)}</span>
                            </div>
                        </div>

                        <div className="cart-drawer__footer-actions">
                            <Button
                                variant="primary"
                                onClick={handleSendOrder}
                                className="cart-drawer__checkout-btn"
                            >
                                Enviar pedido por WhatsApp <span className='whatsapp-cart-icon'><FaWhatsapp /></span>
                            </Button>

                            <button
                                className="cart-drawer__clear-all-btn"
                                onClick={clearCart}
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default CartDrawer;
