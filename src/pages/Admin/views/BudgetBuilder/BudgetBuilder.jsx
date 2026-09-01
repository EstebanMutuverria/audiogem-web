/**
 * BudgetBuilder.jsx
 * Página de construcción de presupuestos (placeholder).
 * La funcionalidad completa (picker de productos, line items, metadatos y
 * descarga de PDF) se implementa en un slice posterior.
 */

import './BudgetBuilder.css';

const BudgetBuilder = () => {
    return (
        <section className="budget-builder">
            <p className="budget-builder__label">Módulo de presupuestos</p>
            <h2 className="budget-builder__title">Próximamente: presupuestos</h2>
            <p className="budget-builder__text">
                Acá vas a poder armar presupuestos a partir del catálogo y
                descargarlos como PDF.
            </p>
        </section>
    );
};

export default BudgetBuilder;
