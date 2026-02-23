/**
 * CategoriesSection.jsx
 * Grid de categorías de productos en el Home.
 */

import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { CATEGORIES } from '../../services/productsData';
import './CategoriesSection.css';

const CategoriesSection = () => {
    const ref = useScrollReveal();

    return (
        <section className="categories reveal" ref={ref}>
            <div className="categories__container">
                <div className="section-header section-header--center">
                    <span className="section-label">Categorías</span>
                    <div className="divider divider--center" />
                    <h2 className="section-title">Todo lo que necesitás</h2>
                    <p className="section-subtitle">
                        Encontrá todo lo que necesitás para armar el sistema de audio perfecto para tu vehículo.
                    </p>
                </div>

                <div className="categories__grid">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            to="/productos"
                            className="category-card"
                            aria-label={`Ver ${cat.label}`}
                        >
                            <span className="category-card__icon">{cat.icon}</span>
                            <span className="category-card__label">{cat.label}</span>
                            <span className="category-card__desc">{cat.description}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
