/**
 * BudgetBuilder.jsx
 * Orquestador de presupuestos de administración: picker de productos del
 * catálogo, line items con steppers, formulario de metadatos y descarga de
 * PDF. Compone useBudget, BudgetItem, BudgetSummary y buildBudgetPdf.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
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

    const [selectedProductId, setSelectedProductId] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [clientName, setClientName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [validity, setValidity] = useState('');
    const [formError, setFormError] = useState('');

    // Estado del buscador de productos
    const [query, setQuery] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null);

    const selectedProduct = ALL_PRODUCTS.find((product) => product.id === selectedProductId);

    // Filtra productos por nombre o descripción según la búsqueda del usuario.
    // Sin texto, devuelve el catálogo completo (la lista es scrolleable).
    const filteredProducts = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return ALL_PRODUCTS;
        return ALL_PRODUCTS.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                (product.description || '').toLowerCase().includes(term)
        );
    }, [query]);

    // Cierra el dropdown al hacer clic fuera del buscador.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectProduct = (product) => {
        setSelectedProductId(product.id);
        setQuery(product.name);
        setIsPickerOpen(false);
    };

    const handleSearchChange = (value) => {
        setQuery(value);
        // Si el usuario edita el texto, la selección vigente deja de coincidir.
        setSelectedProductId('');
        setIsPickerOpen(true);
    };

    const handleAddProduct = () => {
        if (selectedProduct) {
            addItem(selectedProduct);
        }
        setQuery('');
        setSelectedProductId('');
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

    const handleDownload = async () => {
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

        await buildBudgetPdf({ header, items });
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
                        <label className="budget-builder__field-label" htmlFor="budget-product-search">
                            Producto del catálogo
                        </label>
                        <div className="budget-builder__picker-row">
                            <div
                                className="budget-builder__search"
                                ref={pickerRef}
                            >
                                <input
                                    id="budget-product-search"
                                    className="budget-builder__search-input"
                                    type="text"
                                    value={query}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onFocus={() => setIsPickerOpen(true)}
                                    placeholder="Buscar por nombre o descripción…"
                                    autoComplete="off"
                                    aria-label="Buscar producto del catálogo"
                                    aria-expanded={isPickerOpen}
                                    aria-controls="budget-product-options"
                                />
                                {isPickerOpen && (
                                    <ul
                                        id="budget-product-options"
                                        className="budget-builder__search-list"
                                        role="listbox"
                                        aria-label="Resultados de productos"
                                    >
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <li key={product.id} role="option" aria-selected={product.id === selectedProductId}>
                                                    <button
                                                        type="button"
                                                        className="budget-builder__search-option"
                                                        onClick={() => handleSelectProduct(product)}
                                                    >
                                                        <span className="budget-builder__search-option-name">
                                                            {product.name}
                                                        </span>
                                                        {product.description && (
                                                            <span className="budget-builder__search-option-desc">
                                                                {product.description}
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="budget-builder__search-empty">
                                                Sin resultados para “{query.trim()}”
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <button
                                type="button"
                                className="budget-builder__add-btn"
                                onClick={handleAddProduct}
                            >
                                Agregar
                            </button>
                        </div>
                        {selectedProduct ? (
                            <span className="budget-builder__picker-price">
                                {selectedProduct.price}
                            </span>
                        ) : (
                            query.trim() && (
                                <span className="budget-builder__search-hint">
                                    Seleccioná un producto de la lista para agregarlo.
                                </span>
                            )
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
