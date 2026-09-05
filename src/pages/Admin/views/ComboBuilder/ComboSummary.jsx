/**
 * ComboSummary.jsx
 * Resumen de precios del combo: filas de totales (venta, base, descuento máximo),
 * input de descuento a aplicar con validación inline, precio final calculado
 * (venta - descuento), ganancia y botón de guardar.
 * El botón se deshabilita cuando el combo está vacío, el descuento no es válido
 * o el nombre está vacío.
 */

import { parsePrice, formatPrice } from '../../../../utils/price';
import './ComboSummary.css';

/**
 * @param {Object} props
 * @param {number} props.totalSalePrice - Total de venta en dominio numérico.
 * @param {number} props.totalBasePrice - Total base en dominio numérico.
 * @param {number} props.maxDiscount - Descuento máximo posible (venta - base).
 * @param {string} props.discount - Descuento crudo del input (string).
 * @param {boolean} props.isDiscountValid - true si el descuento es válido.
 * @param {boolean} props.isEmpty - true si no hay items.
 * @param {string} props.comboName - Nombre del combo.
 * @param {(discountStr: string) => void} props.setDiscount - Setter del descuento.
 * @param {() => void} props.onSave - Callback de guardado.
 */
const ComboSummary = ({
    totalSalePrice,
    totalBasePrice,
    maxDiscount,
    discount,
    isDiscountValid,
    isEmpty,
    comboName,
    setDiscount,
    onSave,
}) => {
    const saveDisabled = isEmpty || !isDiscountValid || !comboName.trim();

    const parsedDiscount =
        discount && discount.trim() !== '' ? parsePrice(discount) : 0;
    const finalPrice = totalSalePrice - parsedDiscount;
    const profit = finalPrice - totalBasePrice;

    return (
        <div className="combo-summary">
            <div className="combo-summary__row">
                <span>Total venta:</span>
                <span className="combo-summary__amount">
                    {formatPrice(totalSalePrice)}
                </span>
            </div>

            <div className="combo-summary__row">
                <span>Total base:</span>
                <span className="combo-summary__amount combo-summary__amount--base">
                    {formatPrice(totalBasePrice)}
                </span>
            </div>

            <div className="combo-summary__row">
                <span>Descuento máximo:</span>
                <span className="combo-summary__amount combo-summary__amount--discount">
                    {formatPrice(maxDiscount)}
                </span>
            </div>

            <div className="combo-summary__row combo-summary__row--input">
                <label htmlFor="combo-discount-input" className="combo-summary__label">
                    Descuento a aplicar:
                </label>
                <input
                    id="combo-discount-input"
                    type="text"
                    className="combo-summary__price-input"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="Ej: 20000"
                    disabled={isEmpty}
                    inputMode="numeric"
                />
            </div>

            <div className="combo-summary__row">
                <span>Precio final del combo:</span>
                <span className="combo-summary__amount combo-summary__amount--final">
                    {formatPrice(finalPrice)}
                </span>
            </div>

            <div className="combo-summary__row">
                <span>Ganancia:</span>
                <span className="combo-summary__amount combo-summary__amount--profit">
                    {formatPrice(profit)}
                </span>
            </div>

            {!isDiscountValid && discount && discount.trim() !== '' && (
                <p className="combo-summary__error">
                    El descuento no puede superar {formatPrice(maxDiscount)} para
                    no perder dinero.
                </p>
            )}

            {isEmpty && (
                <p className="combo-summary__empty">
                    Agregá al menos un producto para configurar el descuento del combo.
                </p>
            )}

            <button
                type="button"
                className="combo-summary__save-btn"
                onClick={onSave}
                disabled={saveDisabled}
            >
                Guardar combo
            </button>
        </div>
    );
};

export default ComboSummary;