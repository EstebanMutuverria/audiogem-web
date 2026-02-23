/**
 * ProductsPage.jsx
 * Página de catálogo informativo con filtrado por categoría.
 */

import { useState } from 'react';
import { ALL_PRODUCTS } from '../services/productsData';
import CategoryFilter from '../features/products/CategoryFilter';
import ProductCatalog from '../features/products/ProductCatalog';

const ProductsPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    // Lógica de filtrado
    const filteredProducts = activeCategory === 'all'
        ? ALL_PRODUCTS
        : ALL_PRODUCTS.filter(p => p.category === activeCategory);

    return (
        <div className="container section">
            <div className="section-header section-header--center">
                <span className="section-label">Nuestro Catálogo</span>
                <h1 className="section-title">Encontrá el sonido perfecto</h1>
                <p className="section-subtitle">
                    Explorá nuestra amplia gama de productos de alta fidelidad.
                    Cada pieza está seleccionada para ofrecer el mejor rendimiento.
                </p>
            </div>

            <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <ProductCatalog products={filteredProducts} />
        </div>
    );
};

export default ProductsPage;
