/**
 * OrderSummary.jsx
 * Resumen del pedido: total de costo derivado, cantidad de productos,
 * mensaje de error (si lo hay) y botón de guardar.
 * El botón se deshabilita cuando el pedido está vacío o falta el proveedor.
 */

import { formatPrice } from '../../../../utils/price';
import './OrderBuilder.css';

/**
 * @param {Object} props
 * @param {number} props.totalBaseCost - Total de costo en dominio numérico.
 * @param {boolean} props.isEmpty - true si no hay items.
 * @param {boolean} props.supplierMissing - true si falta el nombre del proveedor.
 * @param {() => void} props.onSave - Callback de guardado.
 * @param {string} [props.error] - Mensaje de error opcional.
 * @param {number} [props.itemsCount] - Cantidad de productos del pedido.
 */
const OrderSummary = ({
    totalBaseCost,
    isEmpty,
    supplierMissing,
    onSave,
    error,
    itemsCount,
}) => {
    const saveDisabled = isEmpty || supplierMissing;

    return (
        <div className="order-summary">
            <div className="order-summary__row">
                <span>Total del pedido (costo):</span>
                <span className="order-summary__amount">
                    {formatPrice(totalBaseCost)}
                </span>
            </div>

            {itemsCount !== undefined && (
                <div className="order-summary__row order-summary__row--muted">
                    <span>Productos:</span>
                    <span>
                        {itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}
                    </span>
                </div>
            )}

            {error && (
                <p className="order-summary__error" role="alert">
                    {error}
                </p>
            )}

            {isEmpty ? (
                <p className="order-summary__empty">
                    Agregá al menos un producto para guardar el pedido.
                </p>
            ) : (
                supplierMissing && (
                    <p className="order-summary__empty">
                        Completá el nombre del proveedor para guardar el pedido.
                    </p>
                )
            )}

            <button
                type="button"
                className="order-summary__save-btn"
                onClick={onSave}
                disabled={saveDisabled}
            >
                Guardar pedido
            </button>
        </div>
    );
};

export default OrderSummary;