/**
 * BudgetBuilder.jsx
 * Orquestador de presupuestos de administración: picker de productos del
 * catálogo, line items con steppers, formulario de metadatos y descarga de
 * PDF. Compone useBudget, BudgetItem, BudgetSummary y buildBudgetPdf.
 */

import { useState } from 'react';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import { useBudget } from '../../hooks/useBudget';
import { buildBudgetPdf } from '../../utils/budgetPdf';
import { parsePrice } from '../../../../utils/price';
import BudgetItem from './BudgetItem';
import BudgetSummary from './BudgetSummary';
import './BudgetBuilder.css';

const BudgetBuilder = () => {
    const {
        lineItems,
        budgetTotal,
        addItem,
        updateQuantity,
        removeItem,
        clearBudget,
        isEmpty,
    } = useBudget();

    const [selectedProductId, setSelectedProductId] = useState(ALL_PRODUCTS[0]?.id ?? '');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [validity, setValidity] = useState('');
    const [formError, setFormError] = useState('');

    const selectedProduct = ALL_PRODUCTS.find((product) => product.id === selectedProductId);

    const handleAddProduct = () => {
        if (selectedProduct) {
            addItem(selectedProduct);
        }
    };

    const handleClear = () => {
        clearBudget();
        setCompany('');
        setDate('');
        setClientName('');
        setVehicle('');
        setValidity('');
        setFormError('');
    };

    const handleDownload = () => {
        if (isEmpty) return;

        if (!company.trim() || !date) {
            setFormError('Completá Empresa y Fecha para generar el presupuesto.');
            return;
        }
        setFormError('');

        // Solo campos públicos: name, price (numérico), quantity, subtotal.
        // base_price jamás viaja al generador de PDF.
        const items = lineItems.map(({ product, quantity }) => {
            const price = parsePrice(product.price);
            return {
                name: product.name,
                price,
                quantity,
                subtotal: price * quantity,
            };
        });

        const header = { company: company.trim(), date };
        if (clientName.trim()) header.clientName = clientName.trim();
        if (vehicle.trim()) header.vehicle = vehicle.trim();
        if (validity.trim()) header.validity = validity.trim();

        buildBudgetPdf({ header, items });
    };

    return (
        <section className="budget-builder">
            <header className="budget-builder__header">
                <div className="budget-builder__heading">
                    <span className="budget-builder__label">Nuevo presupuesto</span>
                    <p className="budget-builder__hint">
                        Seleccioná productos del catálogo, ajustá cantidades y
                        completá los datos para generar el PDF.
                    </p>
                </div>
                <button
                    type="button"
                    className="budget-builder__clear"
                    onClick={handleClear}
                    disabled={isEmpty}
                    title="Vaciar presupuesto y formulario"
                >
                    Nuevo presupuesto
                </button>
            </header>

            <div className="budget-builder__layout">
                {/* Columna izquierda: picker + line items */}
                <div className="budget-builder__products">
                    <div className="budget-builder__picker">
                        <label className="budget-builder__field-label" htmlFor="budget-product">
                            Producto del catálogo
                        </label>
                        <div className="budget-builder__picker-row">
                            <select
                                id="budget-product"
                                className="budget-builder__select"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                            >
                                {ALL_PRODUCTS.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                className="budget-builder__add-btn"
                                onClick={handleAddProduct}
                            >
                                Agregar
                            </button>
                        </div>
                        {selectedProduct && (
                            <span className="budget-builder__picker-price">
                                {selectedProduct.price}
                            </span>
                        )}
                    </div>

                    {isEmpty ? (
                        <p className="budget-builder__empty">
                            Todavía no elegiste productos. Agregá al menos uno desde el catálogo
                            para empezar a armar el presupuesto.
                        </p>
                    ) : (
                        <ul className="budget-builder__list">
                            {lineItems.map((item) => (
                                <li key={item.product.id} className="budget-builder__list-item">
                                    <BudgetItem
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeItem={removeItem}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Columna derecha: metadatos + resumen */}
                <div className="budget-builder__side">
                    <form
                        className="budget-builder__form"
                        onSubmit={(e) => e.preventDefault()}
                        noValidate
                    >
                        <h3 className="budget-builder__form-title">Datos del presupuesto</h3>

                        <div className="budget-builder__field">
                            <label className="budget-builder__field-label" htmlFor="budget-company">
                                Empresa <span className="budget-builder__required">*</span>
                            </label>
                            <input
                                id="budget-company"
                                type="text"
                                className="budget-builder__input"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                                placeholder="Nombre de la empresa"
                            />
                        </div>

                        <div className="budget-builder__field">
                            <label className="budget-builder__field-label" htmlFor="budget-date">
                                Fecha <span className="budget-builder__required">*</span>
                            </label>
                            <input
                                id="budget-date"
                                type="date"
                                className="budget-builder__input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="budget-builder__field">
                            <label className="budget-builder__field-label" htmlFor="budget-client">
                                Nombre del cliente
                            </label>
                            <input
                                id="budget-client"
                                type="text"
                                className="budget-builder__input"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="budget-builder__field">
                            <label className="budget-builder__field-label" htmlFor="budget-vehicle">
                                Vehículo
                            </label>
                            <input
                                id="budget-vehicle"
                                type="text"
                                className="budget-builder__input"
                                value={vehicle}
                                onChange={(e) => setVehicle(e.target.value)}
                                placeholder="Opcional"
                            />
                        </div>

                        <div className="budget-builder__field">
                            <label className="budget-builder__field-label" htmlFor="budget-validity">
                                Validez
                            </label>
                            <input
                                id="budget-validity"
                                type="text"
                                className="budget-builder__input"
                                value={validity}
                                onChange={(e) => setValidity(e.target.value)}
                                placeholder="Opcional"
                            />
                        </div>

                        {formError && (
                            <p className="budget-builder__error" role="alert">
                                {formError}
                            </p>
                        )}
                    </form>

                    <BudgetSummary
                        budgetTotal={budgetTotal}
                        isEmpty={isEmpty}
                        onDownload={handleDownload}
                    />
                </div>
            </div>
        </section>
    );
};

export default BudgetBuilder;
