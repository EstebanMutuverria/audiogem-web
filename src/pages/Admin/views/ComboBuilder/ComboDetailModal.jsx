/**
 * ComboDetailModal.jsx
 * Modal que muestra el detalle completo de un combo guardado:
 * nombre, productos con cantidades y precios, y resumen de pricing.
 * Con variant="pedido" funciona como modal de pedidos de compra:
 * muestra los items persistidos con su costo, subtotales y total, y
 * permite descargar el PDF.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiDownload, FiCopy, FiCheck } from 'react-icons/fi';
import { formatPrice } from '../../../../utils/price';
import { resolveComboTotals } from './comboTotals';
import { buildOrderPdf } from '../../utils/orderPdf';
import './ComboDetailModal.css';

/**
 * @param {Object} props
 * @param {Object|null} props.combo - Combo o pedido guardado (según variant).
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.variant] - 'combo' (default) | 'pedido'.
 */
const ComboDetailModal = ({ combo, isOpen, onClose, variant = 'combo' }) => {
    const isOrder = variant === 'pedido';
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState('');
    const [isCopying, setIsCopying] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState('');

    // Cerrar con Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen || !combo) return null;

    // En modo combo los totales se resuelven contra el catálogo actual;
    // en modo pedido los items ya vienen persistidos con su costo unitario.
    const comboTotals = isOrder ? null : resolveComboTotals(combo);
    const resolvedItems = isOrder ? combo.items : comboTotals.resolvedItems;

    // Total de costo del pedido (subtotales sumados).
    const totalOrderCost = isOrder
        ? combo.items.reduce((acc, item) => acc + item.unitCost * item.quantity, 0)
        : 0;

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        setDownloadError('');
        try {
            await buildOrderPdf({
                header: {
                    company: 'Audio Gem',
                    date: new Date(combo.createdAt).toLocaleDateString('es-AR'),
                    supplier: combo.supplierName,
                },
                items: combo.items.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                })),
            });
        } catch {
            setDownloadError('No se pudo generar el PDF. Intentá de nuevo.');
        } finally {
            setIsDownloading(false);
        }
    };

    const buildAiPrompt = () => {
        const productsList = resolvedItems
            .map((item) => `• ${item.productName} — x${item.quantity}`)
            .join('\n');
        const priceFormatted = formatPrice(comboTotals.finalPrice);

        return `Actuá como un **diseñador gráfico profesional especializado en publicidad de productos de audio para automóviles y e-commerce**.

Quiero crear una **imagen publicitaria profesional para Audiogem** promocionando un combo de productos.

Voy a proporcionarte:

1. El nombre de cada producto.
2. La cantidad de cada producto.
3. El precio total del combo.
4. Las fotografías originales de los productos.

### DATOS DEL COMBO

**Productos:**
${productsList}

**Precio total del combo:**
${priceFormatted}

### INSTRUCCIONES PARA LA IMAGEN

Creá una publicidad de aspecto **profesional, moderno, atractivo, minimalista y comercial**, pensada para vender el combo en redes sociales y canales de venta de Audiogem.

La composición debe mostrar claramente **todos los productos incluidos en el combo**, utilizando las fotografías que adjunto como referencia principal.

### REGLAS IMPORTANTES SOBRE LOS PRODUCTOS

* **NO modificar los productos originales.**
* Mantener exactamente su diseño, forma, proporciones, colores, logos, marcas, textos, conexiones, botones, detalles y características visuales.
* No inventar productos ni reemplazar productos por otros similares.
* No cambiar marcas.
* No agregar ni quitar componentes de los productos.
* No alterar los textos impresos en los productos.
* No deformar, estirar ni modificar las proporciones.
* Si un producto aparece en varias unidades, representar correctamente la cantidad indicada.
* Las fotografías proporcionadas son la referencia visual principal y deben respetarse fielmente.
* Se pueden eliminar o limpiar fondos de las fotografías para integrarlas al diseño, pero **el producto en sí debe permanecer idéntico**.

### DISEÑO PUBLICITARIO

Crear una composición visual donde los productos sean los protagonistas.

Organizá los productos de forma equilibrada, evitando que se vean excesivamente grandes o amontonados.

Dejá suficiente espacio entre ellos para que cada producto pueda identificarse fácilmente.

Utilizá un fondo y elementos gráficos relacionados con **audio para automóviles**, tecnología y sonido, pero sin sobrecargar la imagen.

El diseño debe transmitir:

* Potencia
* Calidad
* Tecnología
* Oferta
* Profesionalismo
* Urgencia de compra

### TEXTO OBLIGATORIO

La publicidad debe incluir de forma **muy visible y llamativa** la frase:

**"SOLO POR HOY"**

Esta frase es OBLIGATORIA y debe aparecer en alguna parte de la imagen, preferentemente como una etiqueta, sello o elemento destacado de la promoción.

También debe aparecer claramente:

**COMBO AUDİOGEM**

y el precio:

**${priceFormatted}**

El precio debe tener suficiente tamaño y contraste para ser uno de los elementos visuales más importantes de la publicidad.

### INFORMACIÓN DE PRODUCTOS

Mostrar los productos incluidos mediante textos breves y fáciles de leer.

${productsList}

Adaptá automáticamente esta sección a los productos y cantidades que proporcione.

### ESTILO

El resultado debe parecer una **publicidad real de una tienda profesional de audio para autos**, no una imagen genérica de IA.

Utilizá:

* Tipografía moderna y fuerte.
* Jerarquía visual clara.
* Alto contraste.
* Composición limpia.
* Iluminación profesional.
* Efectos gráficos sutiles relacionados con sonido/audio.
* Elementos visuales que ayuden a destacar la oferta sin tapar los productos.

**No sobrecargar el diseño.**

Los productos y el precio deben ser los protagonistas.

### FORMATO

Crear una imagen publicitaria optimizada para **Instagram, Facebook, WhatsApp y publicaciones de e-commerce**.

Preferentemente utilizar formato **vertical 4:5**, salvo que indique otro formato.

### REGLA FINAL

Antes de generar la imagen, verificá que:

✓ Aparezcan todos los productos.
✓ Las cantidades sean correctas.
✓ Los productos sean visualmente fieles a las fotografías originales.
✓ El precio sea exactamente el proporcionado.
✓ Aparezca obligatoriamente **"SOLO POR HOY"**.
✓ Aparezca **"COMBO AUDIOGEM"**.
✓ No haya productos inventados.
✓ No se haya modificado ningún producto.
✓ Los textos sean legibles.
✓ La composición sea limpia, profesional y orientada a la venta.

**No inventes información que no haya proporcionado.**`;
    };

    const handleCopyPrompt = async () => {
        setIsCopying(true);
        setCopySuccess(false);
        setCopyError('');
        try {
            const prompt = buildAiPrompt();
            await navigator.clipboard.writeText(prompt);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
            setCopyError('No se pudo copiar. Intentá de nuevo.');
        } finally {
            setIsCopying(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="combo-detail-modal"
                    className="combo-detail__overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="combo-detail-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="combo-detail__panel"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="combo-detail__header">
                            <div>
                                <span className="combo-detail__badge">
                                    {isOrder ? 'Pedido' : 'Combo'}
                                </span>
                                <h2 className="combo-detail__title" id="combo-detail-title">
                                    {isOrder ? combo.supplierName : combo.name}
                                </h2>
                            </div>
                            <button
                                className="combo-detail__close"
                                onClick={onClose}
                                aria-label={
                                    isOrder
                                        ? 'Cerrar detalle del pedido'
                                        : 'Cerrar detalle del combo'
                                }
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Lista de productos */}
                        <div className="combo-detail__products">
                            <div className="combo-detail__table-header">
                                <span>Producto</span>
                                <span>Cant.</span>
                                <span>{isOrder ? 'P. Costo' : 'P. Unit.'}</span>
                                <span>Subtotal</span>
                            </div>
                            <ul className="combo-detail__list">
                                {resolvedItems.map((item, index) => (
                                    <li
                                        key={
                                            isOrder
                                                ? `${item.productId ?? 'manual'}-${index}`
                                                : item.productId
                                        }
                                        className="combo-detail__row"
                                    >
                                        <span className="combo-detail__product-name">
                                            {isOrder ? (
                                                item.name
                                            ) : (
                                                <>
{item.productName}
                                                {!item.product && !item.manual && (
                                                    <span className="combo-detail__missing">
                                                        No disponible
                                                    </span>
                                                )}
                                                </>
                                            )}
                                        </span>
                                        <span className="combo-detail__qty">
                                            x{item.quantity}
                                        </span>
                                        <span className="combo-detail__price">
                                            {formatPrice(isOrder ? item.unitCost : item.saleUnit)}
                                        </span>
                                        <span className="combo-detail__subtotal">
                                            {formatPrice(
                                                isOrder
                                                    ? item.unitCost * item.quantity
                                                    : item.saleSubtotal
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resumen de precios (solo modo combo) */}
                        {!isOrder && comboTotals && (
                            <div className="combo-detail__summary">
                                <div className="combo-detail__summary-row">
                                    <span>Total venta</span>
                                    <span>{formatPrice(comboTotals.totalSale)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--muted">
                                    <span>Total base (costo)</span>
                                    <span>{formatPrice(comboTotals.totalBase)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--accent">
                                    <span>Descuento aplicado</span>
                                    <span>{formatPrice(comboTotals.appliedDiscount)}</span>
                                </div>
                                <div
                                    className={`combo-detail__summary-row combo-detail__summary-row--profit${
                                        comboTotals.netProfit < 0
                                            ? ' combo-detail__summary-row--loss'
                                            : ''
                                    }`}
                                >
                                    <span>Ganancia neta</span>
                                    <span>{formatPrice(comboTotals.netProfit)}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--combo">
                                    <span>Precio del combo</span>
                                    <span>{formatPrice(comboTotals.finalPrice)}</span>
                                </div>
                            </div>
                        )}

                        {/* Resumen de totales del pedido */}
                        {isOrder && (
                            <div className="combo-detail__summary">
                                <div className="combo-detail__summary-row combo-detail__summary-row--muted">
                                    <span>Productos</span>
                                    <span>{combo.items.length}</span>
                                </div>
                                <div className="combo-detail__summary-row combo-detail__summary-row--combo">
                                    <span>Total del pedido (costo)</span>
                                    <span>{formatPrice(totalOrderCost)}</span>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="combo-detail__footer">
                            {!isOrder && comboTotals && (
                                <>
                                    <button
                                        type="button"
                                        className="combo-detail__copy-prompt"
                                        onClick={handleCopyPrompt}
                                        disabled={isCopying}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <FiCheck size={16} aria-hidden="true" />
                                                Prompt copiado
                                            </>
                                        ) : (
                                            <>
                                                <FiCopy size={16} aria-hidden="true" />
                                                Copiar prompt IA
                                            </>
                                        )}
                                    </button>
                                    {copyError && (
                                        <p
                                            className="combo-detail__error"
                                            role="alert"
                                        >
                                            {copyError}
                                        </p>
                                    )}
                                </>
                            )}
                            {isOrder && (
                                <>
                                    <button
                                        type="button"
                                        className="combo-detail__download"
                                        onClick={handleDownloadPdf}
                                        disabled={isDownloading}
                                    >
                                        <FiDownload size={16} aria-hidden="true" />
                                        Descargar PDF
                                    </button>
                                    {downloadError && (
                                        <p
                                            className="combo-detail__error"
                                            role="alert"
                                        >
                                            {downloadError}
                                        </p>
                                    )}
                                </>
                            )}
                            <span className="combo-detail__date">
                                Creado: {new Date(combo.createdAt).toLocaleDateString('es-AR')}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ComboDetailModal;