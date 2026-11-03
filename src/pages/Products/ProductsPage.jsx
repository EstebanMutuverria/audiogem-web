/**
 * ProductsPage.jsx
 * Página de catálogo informativo con filtrado por categoría y búsqueda en tiempo real.
 */

import { useState, useMemo, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { ALL_PRODUCTS } from '../../services/products-all.js';
import { CATEGORIES } from '../../services/products-categories.js';
import CATEGORY_NAMES from '../../constants/category_names.js';
import { useAdmin } from '../../context/AdminContext';
import Pagination from '../../components/ui/Pagination';
import CategoryFilter from './views/CategoryFilter/CategoryFilter';
import ProductCatalog from './views/ProductCatalog/ProductCatalog';
import './ProductsPage.css';

const ALL_FILTER = 'all';
const CAJONES_FILTER = CATEGORY_NAMES.CAJONES;
const PRODUCTS_PER_PAGE = 12;

// Cajones solo son visibles para administradores
const isCategoryAllowed = (categoryId, isAdmin) => categoryId !== CAJONES_FILTER || isAdmin;

// Mapa de etiquetas para la búsqueda por categoría (evita un find por producto)
const CATEGORY_LABELS = new Map(CATEGORIES.map(category => [category.id, category.label]));

const ProductsPage = () => {
    const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const catalogRef = useRef(null);
    const { isAdmin } = useAdmin();

    // Filtrar categorías visibles: Cajones solo para admin
    const visibleCategories = useMemo(
        () => CATEGORIES.filter(cat => isCategoryAllowed(cat.id, isAdmin)),
        [isAdmin]
    );

    // Productos visibles según permisos de admin (cajones solo para admin)
    const adminVisibleProducts = useMemo(
        () => ALL_PRODUCTS.filter(p => isCategoryAllowed(p.category, isAdmin)),
        [isAdmin]
    );

    // Categoría efectiva: si la activa deja de estar permitida, se muestra "Todos"
    const effectiveCategory = isCategoryAllowed(activeCategory, isAdmin)
        ? activeCategory
        : ALL_FILTER;

    // Productos base filtrados por categoría activa (solo los publicados)
    const baseFilteredProducts = useMemo(() => {
        const byCategory = effectiveCategory === ALL_FILTER
            ? adminVisibleProducts
            : adminVisibleProducts.filter(p => p.category === effectiveCategory);

        return byCategory.filter(p => p.state === true);
    }, [effectiveCategory, adminVisibleProducts]);

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
            const categoryLabel = (CATEGORY_LABELS.get(product.category) ?? '').toLowerCase();
            const categoryMatch = categoryLabel.includes(query);

            return nameMatch || descMatch || categoryMatch;
        });
    }, [baseFilteredProducts, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
    // Clamp defensivo por si el listado se achica (filtro, búsqueda, permisos)
    const activePage = Math.min(currentPage, totalPages);

    const paginatedProducts = useMemo(() => {
        const start = (activePage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    }, [activePage, filteredProducts]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === activePage) return;
        setCurrentPage(page);
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

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
                        <FiSearch />
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
                            <FiX />
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
                activeCategory={effectiveCategory}
                onCategoryChange={handleCategoryChange}
                categories={visibleCategories}
                allFilterValue={ALL_FILTER}
            />

            <div ref={catalogRef} className="products-page__catalog">
                <ProductCatalog products={paginatedProducts} />
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={activePage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    label="Paginación del catálogo"
                />
            )}
        </div>
    );
};

export default ProductsPage;
