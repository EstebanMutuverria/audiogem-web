/**
 * BudgetItem.jsx
 * Fila de un line item dentro del presupuesto: nombre del producto,
 * steppers de cantidad (+/-), subtotal de la línea y acción de quitar.
 * Refleja el patrón de steppers/subtotal de CartDrawer.jsx.
 */

import { useAdmin } from '../../../../context/AdminContext';
import { formatPrice, parsePrice } from '../../../../utils/price';
import './BudgetItem.css';

/**
 * @param {Object} props
 * @param {{ product: Object, quantity: number }} props.item - Line item del presupuesto.
 * @param {(productId: string, quantity: number) => void} props.updateQuantity
 * @param {(productId: string) => void} props.removeItem
 */
const BudgetItem = ({ item, updateQuantity, removeItem }) => {
    const { product, quantity } = item;
    const { name, price, base_price } = product;
    const { isAdmin } = useAdmin();

    const unitPrice = parsePrice(price);
    const subtotal = unitPrice * quantity;

    return (
        <div className="budget-item">
            <div className="budget-item__info">
                <span className="budget-item__name">{name}</span>
                <span className="budget-item__unit-price">{price} c/u</span>
                {isAdmin && base_price && (
                    <span className="budget-item__cost" title="Precio base (costo)">
                        💰 Costo: {base_price}
                    </span>
                )}
            </div>

            <div className="budget-item__actions">
                <div className="budget-item__qty-selector">
                    <button
                        type="button"
                        className="budget-item__qty-btn"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label={`Restar uno a ${name}`}
                    >
                        –
                    </button>
                    <span className="budget-item__qty-value">{quantity}</span>
                    <button
                        type="button"
                        className="budget-item__qty-btn"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label={`Sumar uno a ${name}`}
                    >
                        +
                    </button>
                </div>

                <span className="budget-item__subtotal">Subtotal: {formatPrice(subtotal)}</span>

                <button
                    type="button"
                    className="budget-item__remove"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Quitar ${name} del presupuesto`}
                    title="Eliminar producto"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default BudgetItem;
