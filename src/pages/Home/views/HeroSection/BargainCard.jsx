/**
 * BargainCard.jsx
 * Tarjeta premium del producto con badge BARGAIN en el Hero.
 * Visual: tarjeta flotante con imagen, precio de oferta y acciones.
 */

import ElectricBorder from '../../../../components/animations/ElectricBorder';
import { LuAudioLines, LuShoppingCart, LuMessageCircle } from "react-icons/lu";
import { useCart } from '../../../../context/CartContext';
import { buildWhatsAppProductUrl } from '../../../../utils/whatsapp';

const BargainCard = ({ product }) => {
    const { addToCart } = useCart();

    const whatsappUrl = buildWhatsAppProductUrl(product);

    return (
        <ElectricBorder
            color="hsl(280, 100%, 65%)"
            speed={1.2}
            chaos={0.18}
            borderRadius={20}
        >
            <div className="hero__bargain-card">
                {/* Badge exclusivo */}
                <div className="hero__bargain-badge">
                    <span className="hero__bargain-badge-dot" />
                    <span>PRECIO EXCLUSIVO</span>
                </div>

                {/* Imagen del producto */}
                <div className="hero__bargain-image">
                    {product.image ? (
                        <img src={product.image} alt={product.name} loading="eager" />
                    ) : (
                        <div className="hero__bargain-image-placeholder">
                            <LuAudioLines />
                        </div>
                    )}
                    {/* Glow detrás de la imagen */}
                    <div className="hero__bargain-image-glow" />
                </div>

                {/* Info del producto */}
                <div className="hero__bargain-info">
                    <span className="hero__bargain-category">
                        {product.brand || 'AudioGem'} · {product.category}
                    </span>
                    <h3 className="hero__bargain-name">{product.name}</h3>
                    <p className="hero__bargain-desc">{product.description}</p>

                    {/* Precio */}
                    <div className="hero__bargain-price-block">
                        <span className="hero__bargain-price-label">Precio de oferta</span>
                        <span className="hero__bargain-price">{product.price}</span>
                    </div>
                </div>

                {/* Acciones */}
                <div className="hero__bargain-actions">
                    <button
                        className="hero__bargain-btn hero__bargain-btn--cart"
                        onClick={() => addToCart(product)}
                        aria-label={`Agregar ${product.name} al carrito`}
                        id="hero-bargain-add-to-cart"
                    >
                        <LuShoppingCart />
                        <span>Agregar al carrito</span>
                    </button>
                    <a
                        className="hero__bargain-btn hero__bargain-btn--whatsapp"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar por ${product.name} vía WhatsApp`}
                        id="hero-bargain-whatsapp"
                    >
                        <LuMessageCircle />
                        <span>Consultar</span>
                    </a>
                </div>
            </div>
        </ElectricBorder>
    );
};

export default BargainCard;
