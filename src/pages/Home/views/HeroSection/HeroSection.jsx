/**
 * HeroSection.jsx
 * Sección principal del Home (above the fold).
 * Visual: Título con gradient, CTA buttons, stats y tarjeta flotante.
 * Si existe un producto con badge BARGAIN, lo muestra como tarjeta premium en el lado visual.
 */

import Button from '../../../../components/ui/Button';
import TextShimmer from '../../../../components/animations/TextShimmer';
import './HeroSection.css';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import BADGE_NAMES from '../../../../constants/badge_names';
import BargainCard from './BargainCard';
import DefaultVisualCard from './DefaultVisualCard';

const STATS = [
    { number: '+100', label: 'Productos' },
    { number: '+10', label: 'Marcas' },
    { number: '+3k', label: 'Clientes' },
];

const HeroSection = () => {
    const bargainProduct = ALL_PRODUCTS.find(p => p.badge === BADGE_NAMES.BARGAIN);

    return (
        <section className="hero" aria-label="Inicio">
            <div className="hero__grid-bg" aria-hidden="true" />

            <div className="hero__container">
                {/* Visual */}
                <div className={`hero__visual${bargainProduct ? ' hero__visual--bargain' : ''}`} aria-hidden={!bargainProduct}>
                    {bargainProduct ? (
                        <BargainCard product={bargainProduct} />
                    ) : (
                        <DefaultVisualCard />
                    )}
                </div>
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
            </div>
        </section>
    );
};

export default HeroSection;
