/**
 * HeroSection.jsx
 * Sección principal del Home (above the fold).
 * Visual: Título con gradient, CTA buttons, stats y tarjeta flotante.
 * Si existe un producto con badge BARGAIN, lo muestra como tarjeta premium en el lado visual.
 */

import { useMemo } from 'react';
import Button from '../../components/ui/Button';
import ElectricBorder from '../../components/animations/ElectricBorder';
import TextShimmer from '../../components/animations/TextShimmer';
import './HeroSection.css';
import { LuAudioLines, LuShoppingCart, LuMessageCircle } from "react-icons/lu";
import { ALL_PRODUCTS } from '../../services/productsData';
import BADGE_NAMES from '../../constants/badge_names';
import { useCart } from '../../context/CartContext';

const STATS = [
    { number: '+100', label: 'Productos' },
    { number: '+10', label: 'Marcas' },
    { number: '+3k', label: 'Clientes' },
];

const BargainCard = ({ product }) => {
    const { addToCart } = useCart();

    const phoneNumber = '1160081534';
    const imageUrl = product.image
        ? (product.image.startsWith('data:') ? '' : `${window.location.origin}${product.image}`)
        : '';
    const message = `Hola AudioGem! Te queria consultar acerca del producto: ${product.name}${imageUrl ? ` - Imagen🔗: ${imageUrl}` : ''}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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

const DefaultVisualCard = () => (
    <ElectricBorder
        color="aqua"
        speed={1}
        chaos={0.15}
        borderRadius={24}
    >
        <div className="hero__visual-card">
            <span className='hero__visual-content'>AudioGem</span>
            <span className='hero__visual-content'><LuAudioLines /></span>
        </div>
    </ElectricBorder>
);

const HeroSection = () => {
    const bargainProduct = useMemo(
        () => ALL_PRODUCTS.find(p => p.badge === BADGE_NAMES.BARGAIN),
        []
    );

    return (
        <section className="hero" aria-label="Inicio">
            <div className="hero__grid-bg" aria-hidden="true" />

            <div className="hero__container">
                {/* Contenido */}
                <div className="hero__content">
                    <div className="hero__label">
                        <span>🏆</span>
                        <TextShimmer as="span" duration={2.5}>
                            Especialistas en audio vehicular
                        </TextShimmer>
                    </div>

                    <h1 className="hero__title">
                        Sonido que{' '}
                        <span className="hero__title-highlight">transforma</span>
                        {' '}tu viaje
                    </h1>

                    <p className="hero__subtitle">
                        Estéreos, parlantes, subwoofers y potencias de las mejores marcas.
                        Asesoramiento personalizado.
                    </p>

                    <div className="hero__actions">
                        <Button to="/productos" size="md">
                            Ver productos
                        </Button>
                        <Button to="/contacto" variant="secondary" size="lg">
                            Contactanos
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="hero__stats">
                        {STATS.map(({ number, label }) => (
                            <div key={label} className="hero__stat">
                                <span className="hero__stat-number">{number}</span>
                                <span className="hero__stat-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual */}
                <div className="hero__visual" aria-hidden={!bargainProduct}>
                    {bargainProduct ? (
                        <BargainCard product={bargainProduct} />
                    ) : (
                        <DefaultVisualCard />
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
