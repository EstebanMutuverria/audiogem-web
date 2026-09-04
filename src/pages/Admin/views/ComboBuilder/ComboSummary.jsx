/**
 * ComboSummary.jsx
 * Resumen de precios del combo: filas de totales (venta, base, descuento máximo),
 * precio combo editable con validación inline, y botón de guardar.
 * El botón se deshabilita cuando el combo está vacío, el precio no es válido
 * o el nombre está vacío.
 */

import { formatPrice } from '../../../../utils/price';
import './ComboSummary.css';

/**
 * @param {Object} props
 * @param {number} props.totalSalePrice - Total de venta en dominio numérico.
 * @param {number} props.totalBasePrice - Total base en dominio numérico.
 * @param {number} props.maxDiscount - Descuento máximo posible.
 * @param {string} props.comboPrice - Precio combo crudo (string del input).
 * @param {boolean} props.isPriceValid - true si el precio combo es válido.
 * @param {boolean} props.isEmpty - true si no hay items.
 * @param {string} props.comboName - Nombre del combo.
 * @param {(priceStr: string) => void} props.setComboPrice - Setter del precio combo.
 * @param {() => void} props.onSave - Callback de guardado.
 */
const ComboSummary = ({
    totalSalePrice,
    totalBasePrice,
    maxDiscount,
    comboPrice,
    isPriceValid,
    isEmpty,
    comboName,
    setComboPrice,
    onSave,
}) => {
    const saveDisabled = isEmpty || !isPriceValid || !comboName.trim();

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
                <span>Descuento aplicado:</span>
                <span className="combo-summary__amount combo-summary__amount--discount-applied">
                    {formatPrice(totalSalePrice - comboPrice)}
                </span>
            </div>

            <div className="combo-summary__row">
                <span>Descuento máximo:</span>
                <span className="combo-summary__amount combo-summary__amount--discount">
                    {formatPrice(maxDiscount)}
                </span>
            </div>

            <div className="combo-summary__row">
                <span>Ganancia:</span>
                <span className="combo-summary__amount combo-summary__amount--profit">
                    {formatPrice(Number(comboPrice || 0) - totalBasePrice)}
                </span>
            </div>

            <div className="combo-summary__row combo-summary__row--input">
                <label htmlFor="combo-price-input" className="combo-summary__label">
                    Precio combo:
                </label>
                <input
                    id="combo-price-input"
                    type="text"
                    className="combo-summary__price-input"
                    value={comboPrice}
                    onChange={(e) => setComboPrice(e.target.value)}
                    placeholder="Ej: 150000"
                    disabled={isEmpty}
                    inputMode="numeric"
                />
            </div>

            {!isPriceValid && comboPrice && comboPrice.trim() !== '' && (
                <p className="combo-summary__error">
                    El precio debe estar entre {formatPrice(totalBasePrice)} y{' '}
                    {formatPrice(totalSalePrice)}.
                </p>
            )}

            {isEmpty && (
                <p className="combo-summary__empty">
                    Agregá al menos un producto para configurar el precio del combo.
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
