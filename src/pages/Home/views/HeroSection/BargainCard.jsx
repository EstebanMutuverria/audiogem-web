/**
 * BargainCard.jsx
 * Tarjeta premium del producto con badge BARGAIN en el Hero.
 * Visual Elite Premium: tarjeta flotante Cyber-Luxe con iluminación neón, glare y micro-acciones.
 */

import ElectricBorder from '../../../../components/animations/ElectricBorder';
import GlareHover from '../../../../components/animations/GlareHover';
import { LuAudioLines, LuShoppingCart, LuMessageCircle, LuZap, LuSparkles } from "react-icons/lu";
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
            borderRadius={22}
        >
            <div className="hero__bargain-card">
                {/* Header Badge */}
                <div className="hero__bargain-header">
                    <div className="hero__bargain-badge">
                        <span className="hero__bargain-badge-dot" />
                        <LuZap className="hero__bargain-badge-icon" />
                        <span>OFERTA EXCLUSIVA</span>
                    </div>
                    <div className="hero__bargain-sparkle">
                        <LuSparkles />
                    </div>
                </div>

                {/* Product image with interactive glare */}
                <GlareHover
                    glareColor="#a78bfa"
                    glareOpacity={0.3}
                    glareAngle={-40}
                    glareSize={280}
                    transitionDuration={600}
                    className="hero__bargain-glare"
                >
                    <div className="hero__bargain-image">
                        {product.image ? (
                            <img src={product.image} alt={product.name} loading="eager" />
                        ) : (
                            <div className="hero__bargain-image-placeholder">
                                <LuAudioLines />
                            </div>
                        )}
                        {/* Glow overlay & cyber accents */}
                        <div className="hero__bargain-image-glow" />
                        <div className="hero__bargain-image-accent">
                            <span>DESTACADO</span>
                        </div>
                    </div>
                </GlareHover>

                {/* Info del producto */}
                <div className="hero__bargain-info">
                    <span className="hero__bargain-category">
                        {product.brand || 'AudioGem'} · {product.category}
                    </span>
                    <h3 className="hero__bargain-name">{product.name}</h3>
                    <p className="hero__bargain-desc">{product.description}</p>

                    {/* Bloque de Precio */}
                    <div className="hero__bargain-price-block">
                        <div className="hero__bargain-price-header">
                            <span className="hero__bargain-price-label">Precio especial</span>
                            <span className="hero__bargain-tag">Ocasión única</span>
                        </div>
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

