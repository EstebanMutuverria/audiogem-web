/**
 * ProductCard.jsx
 * Tarjeta reutilizable para mostrar un producto.
 * Usada en FeaturedProducts (home) y ProductCatalog (página productos).
 */

import './ProductCard.css';
import StarBorder from '../animations/StarBorder';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';

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
    const { name, category, brand, image, description, badge, price, base_price } = product;
    const icon = CATEGORY_ICONS[category] ?? '🎵';
    const { isAdmin } = useAdmin();
    const { addToCart } = useCart();

    const isOutOfStock = badge === 'Sin Stock';

    const phoneNumber = '1160081534';
    const message = `Hola AudioGem! Te queria consultar acerca del producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <article className="product-card">
            {badge && badge !== 'Sin Stock' && <span className="product-card__badge">{badge}</span>}
            {badge && badge === 'Sin Stock' && <span className="product-card__badge out-of-stock">{badge}</span>}

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
                <div className="product-card__prices">
                    <span className="product-card__price">{price}</span>
                    {isAdmin && base_price && (
                        <span className="product-card__base-price" title="Precio base (costo)">
                            💰 Costo: {base_price}
                        </span>
                    )}
                </div>
                <p className="product-card__description">{description}</p>
                <div className="product-card__footer">
                    <div className="product-card__footer-meta">
                        <span className="product-card__brand">{brand || 'AudioGem'}</span>
                    </div>
                    <div className="product-card__actions">
                        <StarBorder
                            as="a"
                            href={whatsappUrl}
                            className="product-card__action"
                            color="#4895ef"
                            speed="3s"
                            thickness={1}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Consultar por ${name} vía WhatsApp`}
                        >
                            <span className="product-card__action-inner">Consultar</span>
                        </StarBorder>

                        <button
                            className="product-card__add-btn"
                            onClick={() => !isOutOfStock && addToCart(product)}
                            disabled={isOutOfStock}
                            aria-label={isOutOfStock ? 'Producto sin stock' : `Agregar ${name} al carrito`}
                        >
                            {isOutOfStock ? 'Sin Stock' : 'Agregar 🛒'}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
