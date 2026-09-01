/**
 * BudgetSummary.jsx
 * Resumen del presupuesto: total acumulado, estado vacío y control de descarga.
 * El control de descarga está deshabilitado cuando el presupuesto está vacío
 * (spec R6) y queda cableado a una callback provista por el orquestador (WU4).
 */

import { formatPrice } from '../../../../utils/price';
import Button from '../../../../components/ui/Button';
import './BudgetSummary.css';

/**
 * @param {Object} props
 * @param {number} props.budgetTotal - Total del presupuesto en dominio numérico.
 * @param {boolean} props.isEmpty - true si el presupuesto no tiene line items.
 * @param {() => void} props.onDownload - Callback de descarga (cableada en el orquestador).
 */
const BudgetSummary = ({ budgetTotal, isEmpty, onDownload }) => {
    return (
        <div className="budget-summary">
            <div className="budget-summary__total-row">
                <span>Total del presupuesto:</span>
                <span className="budget-summary__total-amount">{formatPrice(budgetTotal)}</span>
            </div>

            {isEmpty && (
                <p className="budget-summary__empty">
                    Todavía no agregaste productos al presupuesto. Agregá al menos un artículo
                    para poder generar la descarga en PDF.
                </p>
            )}

            <Button
                variant="primary"
                className="budget-summary__download-btn"
                onClick={onDownload}
                disabled={isEmpty}
            >
                Aceptar o Crear presupuesto
            </Button>
        </div>
    );
};

export default BudgetSummary;
