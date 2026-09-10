/**
 * ComboDetailModal.jsx
 * Modal que muestra el detalle completo de un combo guardado:
 * nombre, productos con cantidades y precios, y resumen de pricing.
 * Con variant="pedido" funciona como modal de pedidos de compra:
 * muestra los items persistidos con su costo, subtotales y total, y
 * permite descargar el PDF.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiDownload } from 'react-icons/fi';
import { formatPrice } from '../../../../utils/price';
import { resolveComboTotals } from './comboTotals';
import { buildOrderPdf } from '../../utils/orderPdf';
import './ComboDetailModal.css';

/**
 * @param {Object} props
 * @param {Object|null} props.combo - Combo o pedido guardado (según variant).
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.variant] - 'combo' (default) | 'pedido'.
 */
const ComboDetailModal = ({ combo, isOpen, onClose, variant = 'combo' }) => {
    const isOrder = variant === 'pedido';
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !combo) return null;

    // En modo combo los totales se resuelven contra el catálogo actual;
    // en modo pedido los items ya vienen persistidos con su costo unitario.
    const comboTotals = isOrder ? null : resolveComboTotals(combo);
    const resolvedItems = isOrder ? combo.items : comboTotals.resolvedItems;

    // Total de costo del pedido (subtotales sumados).
    const totalOrderCost = isOrder
        ? combo.items.reduce((acc, item) => acc + item.unitCost * item.quantity, 0)
        : 0;

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        setDownloadError('');
        try {
            await buildOrderPdf({
                header: {
                    company: 'Audio Gem',
                    date: new Date(combo.createdAt).toLocaleDateString('es-AR'),
                    supplier: combo.supplierName,
                },
                items: combo.items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
            });
        } catch {
            setDownloadError('No se pudo generar el PDF. Intentá de nuevo.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="combo-detail-modal"
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
                                <span className="combo-detail__badge">
                                    {isOrder ? 'Pedido' : 'Combo'}
                                </span>
                                <h2 className="combo-detail__title" id="combo-detail-title">
                                    {isOrder ? combo.supplierName : combo.name}
                                </h2>
                            </div>
                            <button
                                className="combo-detail__close"
                                onClick={onClose}
                                aria-label={
                                    isOrder
                                        ? 'Cerrar detalle del pedido'
                                        : 'Cerrar detalle del combo'
                                }
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Lista de productos */}
                        <div className="combo-detail__products">
                            <div className="combo-detail__table-header">
                                <span>Producto</span>
                                <span>Cant.</span>
                                <span>{isOrder ? 'P. Costo' : 'P. Unit.'}</span>
                                <span>Subtotal</span>
                            </div>
                            <ul className="combo-detail__list">
                                {resolvedItems.map((item, index) => (
                                    <li
                                        key={
                                            isOrder
                                                ? `${item.productId ?? 'manual'}-${index}`
                                                : item.productId
                                        }
                                        className="combo-detail__row"
                                    >
                                        <span className="combo-detail__product-name">
                                            {isOrder ? (
                                                item.name
                                            ) : (
                                                <>
                                                    {item.productName}
                                                    {!item.product && (
                                                        <span className="combo-detail__missing">
                                                            No disponible
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </span>
                                        <span className="combo-detail__qty">
                                            x{item.quantity}
                                        </span>
                                        <span className="combo-detail__price">
                                            {formatPrice(isOrder ? item.unitCost : item.saleUnit)}
                                        </span>
                                        <span className="combo-detail__subtotal">
                                            {formatPrice(
                                                isOrder
                                                    ? item.unitCost * item.quantity
                                                    : item.saleSubtotal
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resumen de precios (solo modo combo) */}
                        {!isOrder && comboTotals && (
                            <div className="combo-detail__summary">
                                <div className="combo-detail__summary-row">
                                    <span>Total venta</span>
                                    <span>{formatPrice(comboTotals.totalSale)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--muted">
                                    <span>Total base (costo)</span>
                                    <span>{formatPrice(comboTotals.totalBase)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--accent">
                                    <span>Descuento aplicado</span>
                                    <span>{formatPrice(comboTotals.appliedDiscount)}</span>
                                </div>
                                <div
                                    className={`combo-detail__summary-row combo-detail__summary-row--profit${
                                        comboTotals.netProfit < 0
                                            ? ' combo-detail__summary-row--loss'
                                            : ''
                                    }`}
                                >
                                    <span>Ganancia neta</span>
                                    <span>{formatPrice(comboTotals.netProfit)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--combo">
                                    <span>Precio del combo</span>
                                    <span>{formatPrice(comboTotals.finalPrice)}</span>
                                </div>
                            </div>
                        )}

                        {/* Resumen de totales del pedido */}
                        {isOrder && (
                            <div className="combo-detail__summary">
                                <div className="combo-detail__summary-row combo-detail__summary-row--muted">
                                    <span>Productos</span>
                                    <span>{combo.items.length}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--combo">
                                    <span>Total del pedido (costo)</span>
                                    <span>{formatPrice(totalOrderCost)}</span>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="combo-detail__footer">
                            {isOrder && (
                                <>
                                    <button
                                        type="button"
                                        className="combo-detail__download"
                                        onClick={handleDownloadPdf}
                                        disabled={isDownloading}
                                    >
                                        <FiDownload size={16} aria-hidden="true" />
                                        Descargar PDF
                                    </button>
                                    {downloadError && (
                                        <p
                                            className="combo-detail__error"
                                            role="alert"
                                        >
                                            {downloadError}
                                        </p>
                                    )}
                                </>
                            )}
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