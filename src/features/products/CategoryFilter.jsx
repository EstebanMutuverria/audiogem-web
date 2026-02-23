/**
 * CategoryFilter.jsx
 * Botonera de filtrado por categoría para el catálogo.
 */

import { CATEGORIES } from '../../services/productsData';
import './CategoryFilter.css';

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
    return (
        <div className="filter">
            <div className="filter__list">
                <button
                    className={`filter__btn ${activeCategory === 'all' ? 'filter__btn--active' : ''}`}
                    onClick={() => onCategoryChange('all')}
                >
                    Todos
                </button>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        className={`filter__btn ${activeCategory === cat.id ? 'filter__btn--active' : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
