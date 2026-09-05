/**
 * CategoryFilter.jsx
 * Botonera de filtrado por categoría para el catálogo.
 */

import './CategoryFilter.css';

const CategoryFilter = ({ activeCategory, onCategoryChange, categories, allFilterValue = 'all' }) => {
    return (
        <div className="filter">
            <div className="filter__list">
                <button
                    className={`filter__btn ${activeCategory === allFilterValue ? 'filter__btn--active' : ''}`}
                    onClick={() => onCategoryChange(allFilterValue)}
                >
                    Todos
                </button>
                {categories.map((cat) => (
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
