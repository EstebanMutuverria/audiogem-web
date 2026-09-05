/**
 * ProductsPage.jsx
 * Página de catálogo informativo con filtrado por categoría y búsqueda en tiempo real.
 */

import { useState, useMemo, useEffect } from 'react';
import { ALL_PRODUCTS } from '../../services/products-all.js';
import { CATEGORIES } from '../../services/products-categories.js';
import CATEGORY_NAMES from '../../constants/category_names.js';
import { useAdmin } from '../../context/AdminContext';
import CategoryFilter from './views/CategoryFilter/CategoryFilter';
import ProductCatalog from './views/ProductCatalog/ProductCatalog';
import './ProductsPage.css';

const ALL_FILTER = 'all';
const CAJONES_FILTER = CATEGORY_NAMES.CAJONES;

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const ProductsPage = () => {
    const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
    const [searchQuery, setSearchQuery] = useState('');
    const { isAdmin } = useAdmin();

    // Filtrar categorías visibles: Cajones solo para admin
    const visibleCategories = CATEGORIES.filter(cat => 
        cat.id !== CAJONES_FILTER || isAdmin
    );

    // Productos visibles según permisos de admin (cajones solo para admin)
    const adminVisibleProducts = useMemo(
        () => ALL_PRODUCTS.filter(p => p.category !== CAJONES_FILTER || isAdmin),
        [isAdmin]
    );

    // Productos base filtrados por categoría activa
    const baseFilteredProducts = useMemo(() => {
        return activeCategory === ALL_FILTER
            ? adminVisibleProducts
            : adminVisibleProducts.filter(p => p.category === activeCategory);
    }, [activeCategory, adminVisibleProducts]);

    // Búsqueda en tiempo real por nombre, descripción y categoría
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return baseFilteredProducts;

        const query = searchQuery.toLowerCase().trim();
        
        return baseFilteredProducts.filter(product => {
            // Buscar en nombre (siempre existe)
            const nameMatch = product.name.toLowerCase().includes(query);
            // Buscar en descripción (puede ser null/undefined)
            const description = product.description ?? '';
            const descMatch = description.toLowerCase().includes(query);
            // Buscar en categoría (usar el label de la categoría)
            const categoryInfo = CATEGORIES.find(c => c.id === product.category);
            const categoryLabel = categoryInfo?.label ?? '';
            const categoryMatch = categoryLabel.toLowerCase().includes(query);
            
            return nameMatch || descMatch || categoryMatch;
        });
    }, [baseFilteredProducts, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Si se selecciona una categoría que no es visible (ej. cajones sin ser admin), resetear a 'all'
    useEffect(() => {
        if (activeCategory !== ALL_FILTER && !visibleCategories.some(c => c.id === activeCategory)) {
            setActiveCategory(ALL_FILTER);
        }
    }, [activeCategory, visibleCategories, isAdmin]);

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

            <div className="products-page__search">
                <label htmlFor="product-search" className="visually-hidden">Buscar productos</label>
                <div className="search-wrapper">
                    <span className="search-icon" aria-hidden="true">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        id="product-search"
                        className="search-input"
                        placeholder="Buscar por nombre, descripción o categoría..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        aria-describedby={searchQuery ? 'search-hint' : undefined}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="search-clear"
                            onClick={handleClearSearch}
                            aria-label="Limpiar búsqueda"
                        >
                            <ClearIcon />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <span id="search-hint" className="search-hint">
                        Mostrando <strong>{filteredProducts.length}</strong> de {baseFilteredProducts.length} productos
                    </span>
                )}
            </div>

            <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={visibleCategories}
                allFilterValue={ALL_FILTER}
            />

            <ProductCatalog products={filteredProducts} />
        </div>
    );
};

export default ProductsPage;
