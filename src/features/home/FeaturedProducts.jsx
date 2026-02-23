/**
 * FeaturedProducts.jsx
 * Muestra los 6 productos destacados en la Home.
 */

import { useScrollReveal } from '../../hooks/useScrollReveal';
import ProductCard from '../../components/ui/ProductCard';
import Button from '../../components/ui/Button';
import { FEATURED_PRODUCTS } from '../../services/productsData';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
    const ref = useScrollReveal();

    return (
        <section className="featured reveal" ref={ref}>
            <div className="featured__container">
                <div className="featured__header">
                    <div>
                        <span className="section-label">Catálogo</span>
                        <h2 className="section-title">Productos destacados</h2>
                        <p className="section-subtitle">
                            Una selección de nuestros productos más populares de las mejores marcas del mercado.
                        </p>
                    </div>
                    <Button to="/productos" variant="secondary">
                        Ver todo el catálogo →
                    </Button>
                </div>

                <div className="featured__grid">
                    {FEATURED_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
