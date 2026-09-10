/**
 * OrderBuilder.jsx
 * Orquestador de pedidos de compra a proveedor: picker de productos del
 * catálogo con buscador, formulario de productos cargados a mano,
 * line items con steppers, proveedor, resumen de costo, listado de
 * pedidos guardados y persistencia en localStorage.
 * Compone useOrder, OrderItem, OrderSummary y el servicio orders.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import { loadOrders, addOrder, deleteOrder } from '../../../../services/orders';
import { useOrder } from '../../hooks/useOrder';
import { parsePrice, formatPrice } from '../../../../utils/price';
import OrderItem from './OrderItem';
import OrderSummary from './OrderSummary';
import ComboDetailModal from '../ComboBuilder/ComboDetailModal';
import './OrderBuilder.css';

const OrderBuilder = () => {
    const {
        orderItems,
        supplierName,
        setSupplierName,
        totalBaseCost,
        isEmpty,
        addCatalogItem,
        addManualItem,
        updateQuantity,
        removeItem,
        clearOrder,
    } = useOrder();

    // Estado del buscador de productos
    const [query, setQuery] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null);

    // Estado del formulario manual
    const [manualName, setManualName] = useState('');
    const [manualPrice, setManualPrice] = useState('');
    const [manualError, setManualError] = useState('');

    // Pedidos guardados en localStorage (se cargan una vez al montar)
    const [savedOrders, setSavedOrders] = useState(() => loadOrders());

    // Pedido seleccionado para mostrar en el modal de detalle
    const [detailOrder, setDetailOrder] = useState(null);

    // Error del guardado (proveedor incompleto)
    const [saveError, setSaveError] = useState('');

    const selectedProduct = ALL_PRODUCTS.find(
        (product) => product.id === selectedProductId
    );

    // Filtra productos por nombre o categoría según la búsqueda del usuario.
    const filteredProducts = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) return [];
        return ALL_PRODUCTS.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                (product.category || '').toLowerCase().includes(term)
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

    const handleSearchChange = (value) => {
        setQuery(value);
        // Si el usuario edita el texto, la selección vigente deja de coincidir.
        setSelectedProductId('');
        setIsPickerOpen(true);
    };

    const handleSelectProduct = (product) => {
        setSelectedProductId(product.id);
        setQuery(product.name);
        setIsPickerOpen(false);
    };

    const handleAddProduct = () => {
        if (selectedProduct) {
            addCatalogItem(selectedProduct);
        }
        setQuery('');
        setSelectedProductId('');
    };

    const handleAddManual = () => {
        if (!manualName.trim()) {
            setManualError('Ingresá el nombre del producto.');
            return;
        }
        if (parsePrice(manualPrice) <= 0) {
            setManualError('Ingresá un precio de costo mayor a $0.');
            return;
        }

        addManualItem(manualName, manualPrice);
        setManualName('');
        setManualPrice('');
        setManualError('');
    };

    const handleClear = () => {
        clearOrder();
        setManualName('');
        setManualPrice('');
        setManualError('');
        setSaveError('');
    };

    const handleSave = () => {
        if (isEmpty || !supplierName.trim()) {
            setSaveError('Completá el nombre del proveedor para guardar el pedido.');
            return;
        }

        const order = {
            id: crypto.randomUUID(),
            supplierName: supplierName.trim(),
            items: orderItems.map(({ productId, name, unitCost, quantity, manual }) => ({
                productId: productId ?? null,
                name,
                unitCost,
                quantity,
                manual,
            })),
            createdAt: new Date().toISOString(),
        };

        const updated = addOrder(order);
        if (updated) {
            setSavedOrders(updated);
            setSaveError('');
            clearOrder();
        }
    };

    const handleDelete = (id) => {
        const updated = deleteOrder(id);
        if (updated) {
            setSavedOrders(updated);
        }
    };

    return (
        <section className="order-builder">
            <header className="order-builder__header">
                <div className="order-builder__heading">
                    <span className="order-builder__label">Nuevo pedido</span>
                    <p className="order-builder__hint">
                        Seleccioná productos del catálogo o cargá productos a mano,
                        ajustá cantidades y definí el proveedor para guardar el pedido.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isEmpty}
                    className="order-builder__button-nuevo"
                >
                    Nuevo pedido
                </button>
            </header>

            <div className="order-builder__layout">
                {/* Columna izquierda: picker + manual + line items */}
                <div className="order-builder__products">
                    <div className="order-builder__picker">
                        <label className="order-builder__field-label" htmlFor="order-product-search">
                            Producto del catálogo
                        </label>
                        <div className="order-builder__picker-row">
                            <div className="order-builder__search" ref={pickerRef}>
                                <div className="order-builder__search-icon">
                                    <FiSearch aria-hidden="true" />
                                </div>
                                <input
                                    id="order-product-search"
                                    className="order-builder__search-input"
                                    type="text"
                                    value={query}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onFocus={() => setIsPickerOpen(true)}
                                    placeholder="Buscar por nombre o categoría…"
                                    autoComplete="off"
                                    aria-label="Buscar producto del catálogo"
                                    aria-expanded={isPickerOpen}
                                    aria-controls="order-product-options"
                                />
                                {isPickerOpen && (
                                    <ul
                                        id="order-product-options"
                                        className="order-builder__search-list"
                                        role="listbox"
                                        aria-label="Resultados de productos"
                                    >
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <li key={product.id} role="option" aria-selected={product.id === selectedProductId}>
                                                    <button
                                                        type="button"
                                                        className="order-builder__search-option"
                                                        onClick={() => handleSelectProduct(product)}
                                                    >
                                                        <span className="order-builder__search-option-name">
                                                            {product.name}
                                                        </span>
                                                        {product.category && (
                                                            <span className="order-builder__search-option-cat">
                                                                {product.category}
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="order-builder__search-empty">
                                                {query.trim()
                                                    ? `Sin resultados para "${query.trim()}"`
                                                    : 'Escribí para buscar productos…'}
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <button
                                type="button"
                                className="order-builder__add-btn"
                                onClick={handleAddProduct}
                            >
                                Agregar
                            </button>
                        </div>
                        {selectedProduct ? (
                            <span className="order-builder__picker-price">
                                Costo base: {formatPrice(parsePrice(selectedProduct.base_price))}
                            </span>
                        ) : (
                            query.trim() && (
                                <span className="order-builder__search-hint">
                                    Seleccioná un producto de la lista para agregarlo.
                                </span>
                            )
                        )}
                    </div>

                    <div className="order-builder__manual">
                        <label className="order-builder__field-label" htmlFor="order-manual-name">
                            Producto no cargado (a mano)
                        </label>
                        <div className="order-builder__manual-row">
                            <input
                                id="order-manual-name"
                                type="text"
                                className="order-builder__manual-input order-builder__manual-input--name"
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                placeholder="Nombre del producto"
                                autoComplete="off"
                            />
                            <input
                                id="order-manual-price"
                                type="text"
                                className="order-builder__manual-input order-builder__manual-input--price"
                                value={manualPrice}
                                onChange={(e) => setManualPrice(e.target.value)}
                                placeholder="$"
                                inputMode="numeric"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                className="order-builder__manual-add"
                                onClick={handleAddManual}
                            >
                                Agregar
                            </button>
                        </div>
                        {manualError && (
                            <p className="order-builder__manual-error" role="alert">
                                {manualError}
                            </p>
                        )}
                    </div>

                    {isEmpty ? (
                        <p className="order-builder__empty">
                            Agregá productos para armar el pedido.
                        </p>
                    ) : (
                        <ul className="order-builder__list">
                            {orderItems.map((item) => (
                                <li key={item.uid} className="order-builder__list-item">
                                    <OrderItem
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeItem={removeItem}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Columna derecha: proveedor + resumen + guardados */}
                <div className="order-builder__side">
                    <div className="order-builder__form">
                        <h3 className="order-builder__form-title">Datos del pedido</h3>

                        <div className="order-builder__field">
                            <label className="order-builder__field-label" htmlFor="order-supplier">
                                Proveedor <span className="order-builder__required">*</span>
                            </label>
                            <input
                                id="order-supplier"
                                type="text"
                                className="order-builder__input"
                                value={supplierName}
                                onChange={(e) => {
                                    setSupplierName(e.target.value);
                                    if (saveError) setSaveError('');
                                }}
                                required
                                placeholder="Nombre del proveedor"
                            />
                        </div>
                    </div>

                    <OrderSummary
                        totalBaseCost={totalBaseCost}
                        itemsCount={orderItems.length}
                        isEmpty={isEmpty}
                        supplierMissing={!supplierName.trim()}
                        onSave={handleSave}
                        error={saveError}
                    />

                    <div className="order-builder__saved">
                        <h3 className="order-builder__form-title">Pedidos guardados</h3>
                        {savedOrders.length === 0 ? (
                            <p className="order-builder__saved-empty">
                                Todavía no guardaste pedidos.
                            </p>
                        ) : (
                            <ul className="order-builder__saved-list">
                                {savedOrders.map((order) => (
                                    <li key={order.id} className="order-builder__saved-item">
                                        <button
                                            type="button"
                                            className="order-builder__saved-info"
                                            onClick={() => setDetailOrder(order)}
                                            aria-label={`Ver detalle del pedido ${order.supplierName}`}
                                            title="Ver detalle del pedido"
                                        >
                                            <span className="order-builder__saved-name">
                                                {order.supplierName}
                                            </span>
                                            <span className="order-builder__saved-meta">
                                                {order.items.length}{' '}
                                                {order.items.length === 1
                                                    ? 'producto'
                                                    : 'productos'}{' '}
                                                ·{' '}
                                                {new Date(order.createdAt).toLocaleDateString('es-AR')}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            className="order-builder__saved-delete"
                                            onClick={() => handleDelete(order.id)}
                                            aria-label={`Eliminar pedido ${order.supplierName}`}
                                            title="Eliminar pedido"
                                        >
                                            <FiTrash2 aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de detalle de un pedido guardado */}
            <ComboDetailModal
                combo={detailOrder}
                isOpen={detailOrder !== null}
                onClose={() => setDetailOrder(null)}
                variant="pedido"
            />
        </section>
    );
};

export default OrderBuilder;