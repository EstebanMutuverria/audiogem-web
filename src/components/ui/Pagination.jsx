/**
 * Pagination.jsx
 * Control de paginación reutilizable con números de página y elipsis.
 */

import './Pagination.css';

const ELLIPSIS_START = 'ellipsis-start';
const ELLIPSIS_END = 'ellipsis-end';

/**
 * Builds the visible page list, collapsing far pages into ellipses.
 * Example: 1 … 6 7 8 … 13
 */
const getPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push(ELLIPSIS_START);
    for (let page = start; page <= end; page += 1) pages.push(page);
    if (end < totalPages - 1) pages.push(ELLIPSIS_END);

    pages.push(totalPages);
    return pages;
};

/**
 * @param {Object} props
 * @param {number} props.currentPage - Página activa (1-based)
 * @param {number} props.totalPages - Total de páginas
 * @param {(page: number) => void} props.onPageChange - Callback al cambiar de página
 * @param {string} [props.label] - Etiqueta accesible de la navegación
 */
const Pagination = ({ currentPage, totalPages, onPageChange, label = 'Paginación' }) => {
    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <nav className="pagination" aria-label={label}>
            <div className="pagination__controls">
                <button
                    type="button"
                    className="pagination__arrow"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                >
                    ←
                </button>

                <ul className="pagination__list">
                    {pages.map((page) => (
                        page === ELLIPSIS_START || page === ELLIPSIS_END ? (
                            <li key={page} className="pagination__ellipsis" aria-hidden="true">
                                …
                            </li>
                        ) : (
                            <li key={page}>
                                <button
                                    type="button"
                                    className={`pagination__page${page === currentPage ? ' pagination__page--active' : ''}`}
                                    onClick={() => onPageChange(page)}
                                    aria-label={`Página ${page}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    ))}
                </ul>

                <button
                    type="button"
                    className="pagination__arrow"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                >
                    →
                </button>
            </div>

            <p className="pagination__status" aria-live="polite">
                Página {currentPage} de {totalPages}
            </p>
        </nav>
    );
};

export default Pagination;
