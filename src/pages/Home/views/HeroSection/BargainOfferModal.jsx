/**
 * BargainOfferModal.jsx
 * Modal que muestra el detalle del producto en oferta (badge BARGAIN) del Hero:
 * nombre, descripción, precio de venta, medidas y peso.
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { LuAudioLines } from 'react-icons/lu';
import './BargainOfferModal.css';

// Formatea medidas a "ancho × profundidad × alto cm"
const formatDimensions = (product) => {
    const { width, depth, height } = product;
    if (width == null && depth == null && height == null) return null;
    const parts = [width, depth, height].filter((d) => d != null);
    return `${parts.join(' × ')} cm`;
};

const BargainOfferModal = ({ product, isOpen, onClose }) => {
    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !product) return null;

    const dimensions = formatDimensions(product);
    const hasWeight = product.weight != null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="bargain-offer-modal"
                    className="bargain-offer__overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="bargain-offer-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bargain-offer__panel"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="bargain-offer__header">
                            <span className="bargain-offer__badge">Oferta exclusiva</span>
                            <button
                                className="bargain-offer__close"
                                onClick={onClose}
                                aria-label="Cerrar detalle de la oferta"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Media */}
                        <div className="bargain-offer__media">
                            {product.image ? (
                                <img src={product.image} alt={product.name} loading="lazy" />
                            ) : (
                                <div className="bargain-offer__media-placeholder">
                                    <LuAudioLines />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="bargain-offer__content">
                            <h2 className="bargain-offer__title" id="bargain-offer-title">
                                {product.name}
                            </h2>
                            {product.description && (
                                <p className="bargain-offer__desc">{product.description}</p>
                            )}

                            {/* Price */}
                            <div className="bargain-offer__price-block">
                                <span className="bargain-offer__price">{product.price}</span>
                            </div>

                            {/* Specs: medidas y peso */}
                            {(dimensions || hasWeight) && (
                                <div className="bargain-offer__specs">
                                    {dimensions && (
                                        <div className="bargain-offer__spec">
                                            <span className="bargain-offer__spec-label">Medidas</span>
                                            <span className="bargain-offer__spec-value">
                                                {dimensions}
                                            </span>
                                        </div>
                                    )}
                                    {hasWeight && (
                                        <div className="bargain-offer__spec">
                                            <span className="bargain-offer__spec-label">Peso</span>
                                            <span className="bargain-offer__spec-value">
                                                {product.weight} kg
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default BargainOfferModal;
