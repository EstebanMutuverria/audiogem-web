/**
 * HeroSection.jsx
 * Sección principal del Home (above the fold).
 * Visual Elite Premium: Título con gradient, CTA buttons, stats interactivos y tarjeta de oferta (BargainCard).
 */

import Button from '../../../../components/ui/Button';
import StarBorder from '../../../../components/animations/StarBorder';
import TextShimmer from '../../../../components/animations/TextShimmer';
import './HeroSection.css';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import BADGE_NAMES from '../../../../constants/badge_names';
import BargainCard from './BargainCard';
import DefaultVisualCard from './DefaultVisualCard';
import { LuAward, LuPackage, LuShieldCheck, LuUsers, LuChevronRight } from 'react-icons/lu';

const STATS = [
    { number: '+100', label: 'Productos', icon: LuPackage },
    { number: '+10', label: 'Marcas top', icon: LuShieldCheck },
    { number: '+3k', label: 'Clientes felices', icon: LuUsers },
];

const HeroSection = () => {
    const bargainProduct = ALL_PRODUCTS.find(p => p.badge === BADGE_NAMES.BARGAIN);

    return (
        <section className="hero" aria-label="Inicio">
            {/* Ambient Lighting & Audio Wave Glows */}
            <div className="hero__glow hero__glow--1" aria-hidden="true" />
            <div className="hero__glow hero__glow--2" aria-hidden="true" />
            <div className="hero__glow hero__glow--3" aria-hidden="true" />
            <div className="hero__grid-bg" aria-hidden="true" />

            {/* Visual Equalizer / Soundwave Ambient Accent */}
            <div className="hero__soundwaves" aria-hidden="true">
                <div className="hero__wave-bar" />
                <div className="hero__wave-bar" />
                <div className="hero__wave-bar" />
                <div className="hero__wave-bar" />
                <div className="hero__wave-bar" />
            </div>

            <div className="hero__container">
                {/* Content column */}
                <div className="hero__content">
                    <div className="hero__label">
                        <span className="hero__label-pulse" />
                        <LuAward className="hero__label-icon" />
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
                        Asesoramiento personalizado e instalación profesional.
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
                                <span>Ver productos</span>
                                <LuChevronRight className="hero__cta-icon" />
                            </Button>
                        </StarBorder>
                        <Button to="/contacto" variant="secondary" size="lg" className="hero__cta-secondary">
                            Contactanos
                        </Button>
                    </div>

                    {/* Stats — glassmorphic cards */}
                    <div className="hero__stats">
                        {STATS.map(({ number, label, icon: Icon }) => (
                            <div key={label} className="hero__stat">
                                <div className="hero__stat-icon-wrapper">
                                    <Icon />
                                </div>
                                <div className="hero__stat-info">
                                    <span className="hero__stat-number">{number}</span>
                                    <span className="hero__stat-label">{label}</span>
                                </div>
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

