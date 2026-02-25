/**
 * HeroSection.jsx
 * Sección principal del Home (above the fold).
 * Visual: Título con gradient, CTA buttons, stats y tarjeta flotante.
 */

import Button from '../../components/ui/Button';
import ElectricBorder from '../../components/animations/ElectricBorder';
import './HeroSection.css';
import { LuAudioLines } from "react-icons/lu";

const STATS = [
    { number: '+100', label: 'Productos' },
    { number: '+10', label: 'Marcas' },
    { number: '+3k', label: 'Clientes' },
];
const HeroSection = () => {
    return (
        <section className="hero" aria-label="Inicio">
            <div className="hero__grid-bg" aria-hidden="true" />

            <div className="hero__container">
                {/* Contenido */}
                <div className="hero__content">
                    <div className="hero__label">
                        <span>🏆</span>
                        Especialistas en audio vehicular
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
                        <Button to="/contacto" variant="secondary" size="md">
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
                <div className="hero__visual" aria-hidden="true">
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
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
