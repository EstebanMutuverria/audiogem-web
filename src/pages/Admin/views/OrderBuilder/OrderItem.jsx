/**
 * OrderItem.jsx
 * Fila de un line item dentro del pedido: nombre del producto, badge
 * "Manual" para productos cargados a mano, costo unitario, steppers de
 * cantidad, subtotal de línea y acción de quitar.
 */

import { formatPrice } from '../../../../utils/price';
import './OrderBuilder.css';

/**
 * @param {Object} props
 * @param {{ uid: string|number, name: string, unitCost: number, quantity: number, manual: boolean }} props.item - Line item del pedido.
 * @param {(uid: string|number, quantity: number) => void} props.updateQuantity
 * @param {(uid: string|number) => void} props.removeItem
 */
const OrderItem = ({ item, updateQuantity, removeItem }) => {
    return (
        <div className="order-item">
            <div className="order-item__info">
                <span className="order-item__name">
                    {item.name}
                    {item.manual && (
                        <span className="order-item__badge">Manual</span>
                    )}
                </span>
                <span className="order-item__unit-cost">
                    costo: {formatPrice(item.unitCost)}
                </span>
            </div>

            <div className="order-item__actions">
                <div className="order-item__qty-selector">
                    <button
                        type="button"
                        className="order-item__qty-btn"
                        onClick={() => updateQuantity(item.uid, item.quantity - 1)}
                        aria-label={`Restar uno a ${item.name}`}
                    >
                        –
                    </button>
                    <span className="order-item__qty-value">{item.quantity}</span>
                    <button
                        type="button"
                        className="order-item__qty-btn"
                        onClick={() => updateQuantity(item.uid, item.quantity + 1)}
                        aria-label={`Sumar uno a ${item.name}`}
                    >
                        +
                    </button>
                </div>

                <span className="order-item__subtotal">
                    {formatPrice(item.unitCost * item.quantity)}
                </span>

                <button
                    type="button"
                    className="order-item__remove"
                    onClick={() => removeItem(item.uid)}
                    aria-label={`Quitar ${item.name} del pedido`}
                    title="Eliminar producto"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default OrderItem;