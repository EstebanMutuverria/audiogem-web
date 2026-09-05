/**
 * BargainBanner.jsx
 * Banner compacto de oferta para mobile/tablet.
 * Reemplaza la tarjeta completa del producto en pantallas chicas:
 * miniatura + nombre + precio exclusivo + acciones (carrito y WhatsApp).
 * Al hacer click sobre el banner se abre el modal de detalle del producto.
 */

import { useState } from 'react';
import { LuAudioLines, LuShoppingCart, LuMessageCircle } from 'react-icons/lu';
import { useCart } from '../../../../context/CartContext';
import { buildWhatsAppProductUrl } from '../../../../utils/whatsapp';
import BargainOfferModal from './BargainOfferModal';

const BargainBanner = ({ product }) => {
    const { addToCart } = useCart();
    const whatsappUrl = buildWhatsAppProductUrl(product);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className="hero__banner"
                onClick={() => setIsOpen(true)}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalle de la oferta: ${product.name}`}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(true);
                    }
                }}
            >
                <div className="hero__banner-media">
                    {product.image ? (
                        <img src={product.image} alt="" loading="eager" />
                    ) : (
                        <LuAudioLines />
                    )}
                </div>

                <div className="hero__banner-info">
                    <span className="hero__banner-badge">Precio exclusivo</span>
                    <span className="hero__banner-name">{product.name}</span>
                    <span className="hero__banner-price">{product.price}</span>
                </div>

                <div className="hero__banner-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="hero__banner-btn hero__banner-btn--cart"
                        onClick={() => addToCart(product)}
                        aria-label={`Agregar ${product.name} al carrito`}
                        id="hero-banner-add-to-cart"
                    >
                        <LuShoppingCart />
                        <span>Agregar al carrito</span>
                    </button>
                    <a
                        className="hero__banner-btn hero__banner-btn--whatsapp"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar por ${product.name} vía WhatsApp`}
                        id="hero-banner-whatsapp"
                    >
                        <LuMessageCircle />
                        <span>Consultar</span>
                    </a>
                </div>
            </div>

            <BargainOfferModal product={product} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default BargainBanner;
