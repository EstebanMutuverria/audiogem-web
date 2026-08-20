/**
 * BargainBanner.jsx
 * Banner compacto de oferta para mobile/tablet.
 * Reemplaza la tarjeta completa del producto en pantallas chicas:
 * miniatura + nombre + precio exclusivo + un solo CTA.
 */

import { Link } from 'react-router-dom';
import { LuArrowRight, LuAudioLines } from 'react-icons/lu';

const BargainBanner = ({ product }) => (
    <Link
        to="/productos"
        className="hero__banner"
        aria-label={`Ver oferta: ${product.name} a ${product.price}`}
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

        <span className="hero__banner-cta">
            <span className="hero__banner-cta-label">Ver oferta</span>
            <LuArrowRight />
        </span>
    </Link>
);

export default BargainBanner;