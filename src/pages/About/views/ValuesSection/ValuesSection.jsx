/**
 * ValuesSection.jsx
 * Sección de valores y pilares de la empresa.
 */

import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import './ValuesSection.css';

const VALUES = [
    {
        icon: '💎',
        title: 'Calidad Premium',
        text: 'Trabajamos con las mejores marcas para asegurar un sonido cristalino y durabilidad extrema.',
    },
    {
        icon: '🎯',
        title: 'Asesoramiento Personalizado',
        text: 'Te ayudamos a elegir el equipo que realmente necesitás, optimizando tu presupuesto según tus gustos musicales.',
    },
    {
        icon: '📦',
        title: 'Envíos a todo el país',
        text: 'Llegamos a cada rincón del país con envíos rápidos y seguros.',
    },
];

const ValuesSection = () => {
    const ref = useScrollReveal();

    return (
        <section className="values reveal" ref={ref}>
            <div className="values__container">
                <div className="section-header section-header--center">
                    <h2 className="section-title">Nuestros Pilares</h2>
                    <div className="divider divider--center" />
                </div>

                <div className="values__grid">
                    {VALUES.map((val) => (
                        <div key={val.title} className="value-card">
                            <span className="value-card__icon">{val.icon}</span>
                            <h3 className="value-card__title">{val.title}</h3>
                            <p className="value-card__text">{val.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ValuesSection;
