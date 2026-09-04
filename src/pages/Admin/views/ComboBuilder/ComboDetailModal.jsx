/**
 * ComboDetailModal.jsx
 * Modal que muestra el detalle completo de un combo guardado:
 * nombre, productos con cantidades y precios, y resumen de pricing.
 */

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import { parsePrice, formatPrice } from '../../../../utils/price';
import './ComboDetailModal.css';

/**
 * Resuelve un productId del combo a su objeto producto del catálogo.
 * Si no se encuentra, devuelve un placeholder.
 */
const resolveProduct = (productId) =>
    ALL_PRODUCTS.find((p) => p.id === productId) || null;

const ComboDetailModal = ({ combo, isOpen, onClose }) => {
    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !combo) return null;

    // Resolver items a productos reales
    const resolvedItems = combo.items.map((item) => {
        const product = resolveProduct(item.productId);
        const saleUnit = product ? parsePrice(product.price) : 0;
        const baseUnit = product ? parsePrice(product.base_price) : 0;
        return {
            ...item,
            product,
            productName: product?.name || 'Producto no encontrado',
            saleUnit,
            baseUnit,
            saleSubtotal: saleUnit * item.quantity,
            baseSubtotal: baseUnit * item.quantity
        };
    });

    const totalSale = resolvedItems.reduce((acc, i) => acc + i.saleSubtotal, 0);
    const totalBase = resolvedItems.reduce((acc, i) => acc + i.baseSubtotal, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="combo-detail__overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="combo-detail-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="combo-detail__panel"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="combo-detail__header">
                            <div>
                                <span className="combo-detail__badge">Combo</span>
                                <h2 className="combo-detail__title" id="combo-detail-title">
                                    {combo.name}
                                </h2>
                            </div>
                            <button
                                className="combo-detail__close"
                                onClick={onClose}
                                aria-label="Cerrar detalle del combo"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Lista de productos */}
                        <div className="combo-detail__products">
                            <div className="combo-detail__table-header">
                                <span>Producto</span>
                                <span>Cant.</span>
                                <span>P. Unit.</span>
                                <span>Subtotal</span>
                            </div>
                            <ul className="combo-detail__list">
                                {resolvedItems.map((item) => (
                                    <li key={item.productId} className="combo-detail__row">
                                        <span className="combo-detail__product-name">
                                            {item.productName}
                                            {!item.product && (
                                                <span className="combo-detail__missing">
                                                    No disponible
                                                </span>
                                            )}
                                        </span>
                                        <span className="combo-detail__qty">
                                            x{item.quantity}
                                        </span>
                                        <span className="combo-detail__price">
                                            {formatPrice(item.saleUnit)}
                                        </span>
                                        <span className="combo-detail__subtotal">
                                            {formatPrice(item.saleSubtotal)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resumen de precios */}
                        <div className="combo-detail__summary">
                            <div className="combo-detail__summary-row">
                                <span>Total venta</span>
                                <span>{formatPrice(totalSale)}</span>
                            </div>
                            <div className="combo-detail__summary-row combo-detail__summary-row--muted">
                                <span>Total base (costo)</span>
                                <span>{formatPrice(totalBase)}</span>
                            </div>
                            <div className="combo-detail__summary-row combo-detail__summary-row--accent">
                                <span>Descuento aplicado</span>
                                <span>{formatPrice(totalSale - combo.comboPrice)}</span>
                            </div>
                            <div className="combo-detail__summary-row combo-detail__summary-row--profit">
                                <span>Ganancia neta</span>
                                <span>{formatPrice(combo.comboPrice - totalBase)}</span>
                            </div>
                            <div className="combo-detail__summary-row combo-detail__summary-row--combo">
                                <span>Precio del combo</span>
                                <span>{formatPrice(combo.comboPrice)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="combo-detail__footer">
                            <span className="combo-detail__date">
                                Creado: {new Date(combo.createdAt).toLocaleDateString('es-AR')}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ComboDetailModal;
