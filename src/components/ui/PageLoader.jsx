/**
 * PageLoader.jsx
 * Fallback de carga para Suspense (lazy loading de páginas).
 */

import './PageLoader.css';

const PageLoader = () => (
    <div className="page-loader" role="status" aria-label="Cargando página...">
        <div className="page-loader__spinner" />
        <span className="page-loader__text">Cargando...</span>
    </div>
);

export default PageLoader;
