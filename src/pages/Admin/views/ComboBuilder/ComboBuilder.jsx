/**
 * ComboBuilder.jsx
 * Orquestador de combos de administración: picker de productos del catálogo,
 * line items con steppers, nombre del combo, resumen de precios, listado de
 * combos guardados y persistencia en localStorage.
 * Compone useCombo, ComboItem, ComboSummary y el servicio combos.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { ALL_PRODUCTS } from '../../../../services/productsData';
import { loadCombos, addCombo, deleteCombo } from '../../../../services/combos';
import { useCombo } from '../../hooks/useCombo';
import { parsePrice, formatPrice } from '../../../../utils/price';
import ComboItem from './ComboItem';
import ComboSummary from './ComboSummary';
import ComboDetailModal from './ComboDetailModal';
import './ComboBuilder.css';

const ComboBuilder = () => {
    const {
        comboItems,
        comboName,
        comboPrice,
        totalSalePrice,
        totalBasePrice,
        maxDiscount,
        isPriceValid,
        isEmpty,
        addItem,
        updateQuantity,
        removeItem,
        setComboName,
        setComboPrice,
        clearCombo,
    } = useCombo();

    // Estado del buscador de productos
    const [query, setQuery] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null);

    // Combos guardados en localStorage (se cargan una vez al montar)
    const [savedCombos, setSavedCombos] = useState(() => loadCombos());

    // Combo seleccionado para mostrar en el modal de detalle
    const [detailCombo, setDetailCombo] = useState(null);

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
        setIsPickerOpen(true);
    };

    const handleAddProduct = (product) => {
        addItem(product);
        setQuery('');
        setIsPickerOpen(false);
    };

    const handleSave = () => {
        if (isEmpty || !isPriceValid || !comboName.trim()) return;

        const combo = {
            id: crypto.randomUUID(),
            name: comboName.trim(),
            items: comboItems.map(({ product, quantity }) => ({
                productId: product.id,
                quantity,
            })),
            comboPrice: parsePrice(comboPrice),
            createdAt: new Date().toISOString(),
        };

        const updated = addCombo(combo);
        if (updated) {
            setSavedCombos(updated);
            clearCombo();
        }
    };

    const handleDelete = (id) => {
        const updated = deleteCombo(id);
        if (updated) {
            setSavedCombos(updated);
        }
    };    return (
        <section className="combo-builder">
            <header className="combo-builder__header">
                <div className="combo-builder__heading">
                    <span className="combo-builder__label">Nuevo combo</span>
                    <p className="combo-builder__hint">
                        Seleccioná productos del catálogo, ajustá cantidades y
                        definí el precio del combo para guardarlo.
                    </p>
                </div>
            </header>

            <div className="combo-builder__layout">
                {/* Columna izquierda: picker + line items */}
                <div className="combo-builder__products">
                    <div className="combo-builder__picker">
                        <label className="combo-builder__field-label" htmlFor="combo-product-search">
                            Producto del catálogo
                        </label>
                        <div className="combo-builder__search" ref={pickerRef}>
                            <div className="combo-builder__search-icon">
                                <FiSearch aria-hidden="true" />
                            </div>
                            <input
                                id="combo-product-search"
                                className="combo-builder__search-input"
                                type="text"
                                value={query}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onFocus={() => setIsPickerOpen(true)}
                                placeholder="Buscar por nombre o categoría…"
                                autoComplete="off"
                                aria-label="Buscar producto del catálogo"
                                aria-expanded={isPickerOpen}
                                aria-controls="combo-product-options"
                            />
                            {isPickerOpen && (
                                <ul
                                    id="combo-product-options"
                                    className="combo-builder__search-list"
                                    role="listbox"
                                    aria-label="Resultados de productos"
                                >
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <li key={product.id} role="option">
                                                <button
                                                    type="button"
                                                    className="combo-builder__search-option"
                                                    onClick={() => handleAddProduct(product)}
                                                >
                                                    <span className="combo-builder__search-option-name">
                                                        {product.name}
                                                    </span>
                                                    {product.category && (
                                                        <span className="combo-builder__search-option-cat">
                                                            {product.category}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="combo-builder__search-empty">
                                            {query.trim()
                                                ? `Sin resultados para "${query.trim()}"`
                                                : 'Escribí para buscar productos…'}
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    {isEmpty ? (
                        <p className="combo-builder__empty">
                            Agregá productos para armar el combo.
                        </p>
                    ) : (
                        <ul className="combo-builder__list">
                            <AnimatePresence initial={false}>
                                {comboItems.map((item) => (
                                    <motion.li
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.18 }}
                                        className="combo-builder__list-item"
                                    >
                                        <ComboItem
                                            item={item}
                                            updateQuantity={updateQuantity}
                                            removeItem={removeItem}
                                        />
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>

                {/* Columna derecha: nombre + resumen + guardados */}
                <div className="combo-builder__side">
                    <div className="combo-builder__form">
                        <h3 className="combo-builder__form-title">Datos del combo</h3>

                        <div className="combo-builder__field">
                            <label className="combo-builder__field-label" htmlFor="combo-name">
                                Nombre <span className="combo-builder__required">*</span>
                            </label>
                            <input
                                id="combo-name"
                                type="text"
                                className="combo-builder__input"
                                value={comboName}
                                onChange={(e) => setComboName(e.target.value)}
                                required
                                placeholder="Ej: Instalación completa"
                            />
                        </div>
                    </div>

                    <ComboSummary
                        totalSalePrice={totalSalePrice}
                        totalBasePrice={totalBasePrice}
                        maxDiscount={maxDiscount}
                        comboPrice={comboPrice}
                        isPriceValid={isPriceValid}
                        isEmpty={isEmpty}
                        comboName={comboName}
                        setComboPrice={setComboPrice}
                        onSave={handleSave}
                    />

                    <div className="combo-builder__saved">
                        <h3 className="combo-builder__form-title">Combos guardados</h3>
                        {savedCombos.length === 0 ? (
                            <p className="combo-builder__saved-empty">
                                Todavía no guardaste combos.
                            </p>
                        ) : (
                            <ul className="combo-builder__saved-list">
                                {savedCombos.map((combo) => (
                                    <li key={combo.id} className="combo-builder__saved-item">
                                        <button
                                            type="button"
                                            className="combo-builder__saved-info"
                                            onClick={() => setDetailCombo(combo)}
                                            aria-label={`Ver detalle del combo ${combo.name}`}
                                            title="Ver detalle del combo"
                                        >
                                            <span
                                                className="combo-builder__saved-name"
                                            >
                                                {combo.name}
                                            </span>
                                            <span className="combo-builder__saved-meta">
                                                {combo.items.length}{' '}
                                                {combo.items.length === 1
                                                    ? 'producto'
                                                    : 'productos'}{' '}
                                                · {formatPrice(combo.comboPrice)}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            className="combo-builder__saved-delete"
                                            onClick={() => handleDelete(combo.id)}
                                            aria-label={`Eliminar combo ${combo.name}`}
                                            title="Eliminar combo"
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

            {/* Modal de detalle de un combo guardado */}
            <ComboDetailModal
                combo={detailCombo}
                isOpen={detailCombo !== null}
                onClose={() => setDetailCombo(null)}
            />
        </section>
    );
};

export default ComboBuilder;
