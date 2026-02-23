/**
 * ProductCatalog.jsx
 * Grid de productos filtrables.
 */

import ProductCard from '../../components/ui/ProductCard';
import './ProductCatalog.css';

const ProductCatalog = ({ products }) => {
    return (
        <div className="catalog">
            <div className="catalog__grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="catalog__empty">
                        <span className="catalog__empty-icon">📂</span>
                        <h3 className="catalog__empty-title">No hay productos</h3>
                        <p className="catalog__empty-text">No encontramos productos en esta categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;
