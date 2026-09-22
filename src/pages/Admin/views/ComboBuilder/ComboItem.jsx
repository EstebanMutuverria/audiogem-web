/**
 * ComboItem.jsx
 * Fila de un line item dentro del combo: nombre del producto (con badge
 * "Manual" para productos cargados a mano), precio unitario de venta,
 * precio base (admin-only), steppers de cantidad, subtotales de línea
 * (venta y base), y acción de quitar.
 */

import { useAdmin } from '../../../../context/AdminContext';
import { formatPrice, parsePrice } from '../../../../utils/price';
import './ComboItem.css';

/**
 * @param {Object} props
 * @param {{ uid: string|number, product?: Object, quantity: number, manual?: boolean, name?: string, price?: string|number }} props.item - Line item del combo.
 * @param {(uid: string|number, quantity: number) => void} props.updateQuantity
 * @param {(uid: string|number) => void} props.removeItem
 */
const ComboItem = ({ item, updateQuantity, removeItem }) => {
    const { product, quantity } = item;
    const isManual = item.manual === true;
    const { isAdmin } = useAdmin();

    // Los items manuales guardan nombre y precio de venta propios.
    const name = isManual ? item.name : product.name;
    const price = isManual ? item.price : product.price;
    const base_price = isManual ? null : product.base_price;

    const unitPrice = parsePrice(price);
    const saleSubtotal = unitPrice * quantity;

    const unitBasePrice = isManual ? 0 : parsePrice(product.base_price);
    const baseSubtotal = unitBasePrice * quantity;

    const hasNullBasePrice =
        !isManual && (!product.base_price || product.base_price === '');

    return (
        <div className="combo-item">
            <div className="combo-item__info">
                <span className="combo-item__name">
                    {name}
                    {isManual && (
                        <span className="combo-item__badge">Manual</span>
                    )}
                </span>
                <span className="combo-item__unit-price">{price} c/u</span>
                {isAdmin && (
                    <span className="combo-item__base-price">
                        {hasNullBasePrice ? (
                            <>
                                <span className="combo-item__base-price--warn">
                                    $0
                                </span>{' '}
                                <span
                                    className="combo-item__base-price-warning"
                                    title="Precio base no disponible"
                                >
                                    ⚠️
                                </span>
                            </>
                        ) : (
                            <>Base: {base_price}</>
                        )}
                    </span>
                )}
            </div>

            <div className="combo-item__actions">
                <div className="combo-item__qty-selector">
                    <button
                        type="button"
                        className="combo-item__qty-btn"
                        onClick={() => updateQuantity(item.uid, quantity - 1)}
                        aria-label={`Restar uno a ${name}`}
                    >
                        –
                    </button>
                    <span className="combo-item__qty-value">{quantity}</span>
                    <button
                        type="button"
                        className="combo-item__qty-btn"
                        onClick={() => updateQuantity(item.uid, quantity + 1)}
                        aria-label={`Sumar uno a ${name}`}
                    >
                        +
                    </button>
                </div>

                <div className="combo-item__subtotals">
                    <span className="combo-item__sale-subtotal">
                        Venta: {formatPrice(saleSubtotal)}
                    </span>
                    {isAdmin && (
                        <span className="combo-item__base-subtotal">
                            Base: {formatPrice(baseSubtotal)}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="combo-item__remove"
                    onClick={() => removeItem(item.uid)}
                    aria-label={`Quitar ${name} del combo`}
                    title="Eliminar producto"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ComboItem;
