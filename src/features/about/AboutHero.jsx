/**
 * AboutHero.jsx
 * Cabecera de la página "Sobre Nosotros".
 */

import './AboutHero.css';

const AboutHero = () => (
    <section className="about-hero">
        <div className="about-hero__container animate-fadeIn">
            <h1 className="about-hero__title">Pasión por el sonido</h1>
            <p className="about-hero__text">
                En AudioGem, no solo vendemos equipos de audio vehicular; te brindamos una
                experiencia sonora única. Desde hace más de 2 años, ayudamos a
                nuestros clientes a encontrar el equilibrio perfecto entre potencia y fidelidad.
            </p>
        </div>
    </section>
);

export default AboutHero;
