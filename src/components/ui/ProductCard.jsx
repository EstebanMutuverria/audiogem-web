/**
 * ProductCard.jsx
 * Tarjeta reutilizable para mostrar un producto.
 * Usada en FeaturedProducts (home) y ProductCatalog (página productos).
 */

import './ProductCard.css';
import StarBorder from '../animations/StarBorder';

const CATEGORY_ICONS = {
    estereos: '🎵',
    parlantes: '🔊',
    subwoofers: '💥',
    potencias: '⚡',
    accesorios: '🔧',
};

/**
 * @param {Object} props
 * @param {Object} props.product - Objeto de producto de productsData.js
 */
const ProductCard = ({ product }) => {
    const { name, category, brand, image, description, badge, price } = product;
    const icon = CATEGORY_ICONS[category] ?? '🎵';

    return (
        <article className="product-card">
            {badge && <span className="product-card__badge">{badge}</span>}

            {/* Imagen / Placeholder */}
            <div className="product-card__image">
                {image ? (
                    <img src={image} alt={name} loading="lazy" />
                ) : (
                    <span className="product-card__image-placeholder" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </div>

            {/* Contenido */}
            <div className="product-card__body">
                <span className="product-card__category">{category}</span>
                <h3 className="product-card__name">{name}</h3>
                <span className="product-card__price">{price}</span>
                <p className="product-card__description">{description}</p>
                <div className="product-card__footer">
                    <span className="product-card__brand">{brand}</span>
                    <StarBorder
                        as="a"
                        href="https://wa.me/1160081534"
                        className="product-card__action"
                        color="#4895ef"
                        speed="4s"
                        thickness={1}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar por ${name} vía WhatsApp`}
                    >
                        <span className="product-card__action-inner">Consultar →</span>
                    </StarBorder>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
