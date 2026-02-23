/**
 * ProductCard.jsx
 * Tarjeta reutilizable para mostrar un producto.
 * Usada en FeaturedProducts (home) y ProductCatalog (página productos).
 */

import './ProductCard.css';

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
    const { name, category, brand, image, description, badge } = product;
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
                <p className="product-card__description">{description}</p>
                <div className="product-card__footer">
                    <span className="product-card__brand">{brand}</span>
                    <a href="https://wa.me/1160081534" className="product-card__action">
                        Consultar →
                    </a>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
