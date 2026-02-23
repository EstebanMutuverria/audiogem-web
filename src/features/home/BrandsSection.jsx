/**
 * BrandsSection.jsx
 * Marquee infinito de las marcas que maneja AudioGem.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';
import { BRANDS } from '../../services/brandsData';
import './BrandsSection.css';

const BrandsSection = () => {
    const ref = useScrollReveal();
    // Duplicamos el array para el efecto de loop sin cortes
    const doubled = [...BRANDS, ...BRANDS];

    return (
        <section className="brands reveal" ref={ref}>
            <div className="brands__container">
                <div className="brands__header">
                    <span className="section-label">Marcas</span>
                    <div className="divider divider--center" />
                    <h2 className="section-title">Trabajamos con los mejores</h2>
                </div>
            </div>

            <div className="brands__marquee-wrapper">
                <div className="brands__marquee">
                    {doubled.map((brand, idx) => (
                        <div key={`${brand.id}-${idx}`} className="brand-pill">
                            {brand.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandsSection;
