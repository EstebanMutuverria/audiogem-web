/**
 * HeroSection.jsx
 * Sección principal del Home (above the fold).
 * Visual: Título con gradient, CTA buttons, stats y tarjeta flotante de bargain.
 * La BargainCard es visible tanto en desktop (columna visual) como en mobile (debajo del CTA).
 */

import Button from '../../../../components/ui/Button';
import StarBorder from '../../../../components/animations/StarBorder';
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
                {/* Content column — always first in DOM so mobile reads it first */}
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
                        <StarBorder
                            as="div"
                            color="hsl(210, 100%, 70%)"
                            speed="4s"
                            thickness={2}
                            borderRadius="var(--radius-full)"
                            className="hero__cta-star"
                        >
                            <Button to="/productos" size="md" className="hero__cta-primary">
                                Ver productos
                            </Button>
                        </StarBorder>
                        <Button to="/contacto" variant="secondary" size="lg">
                            Contactanos
                        </Button>
                    </div>

                    {/* Stats — desktop only (hidden via CSS on mobile) */}
                    <div className="hero__stats">
                        {STATS.map(({ number, label }) => (
                            <div key={label} className="hero__stat">
                                <span className="hero__stat-number">{number}</span>
                                <span className="hero__stat-label">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual column — BargainCard visible on desktop AND mobile */}
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
