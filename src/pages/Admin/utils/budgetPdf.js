/**
 * budgetPdf.js
 * Constructor del documento PDF de presupuesto usando jsPDF.
 * Recibe únicamente campos públicos (name, price, quantity, subtotal);
 * `base_price` no forma parte de la interfaz y jamás se renderiza.
 */

import { jsPDF } from 'jspdf';
import { formatPrice } from '../../../utils/price';

const MARGIN = 14;
const PAGE_WIDTH = 210; // A4 en mm

// Columnas de la tabla de line items (desde el margen izquierdo).
const COLUMNS = [
    { label: 'Producto', x: MARGIN, width: 86 },
    { label: 'Cant.', x: MARGIN + 86, width: 18 },
    { label: 'Precio unit.', x: MARGIN + 104, width: 42 },
    { label: 'Subtotal', x: MARGIN + 146, width: 50 },
];
const ROW_HEIGHT = 8;
const TABLE_WIDTH = COLUMNS[COLUMNS.length - 1].x + COLUMNS[COLUMNS.length - 1].width - MARGIN;

/**
 * Sanitiza el nombre del cliente para usarlo en el nombre de archivo:
 * quita acentos (NFD), reemplaza espacios por guión bajo y elimina
 * caracteres no seguros para nombres de archivo.
 * @param {string} name
 * @returns {string}
 */
export const sanitizeFilename = (name) => {
    if (!name) return '';
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
};

/**
 * Dibuja un texto y devuelve la siguiente coordenada Y.
 */
const drawText = (doc, text, x, y, options = {}) => {
    const { size = 11, align = 'left', style = 'normal' } = options;
    doc.setFont('Helvetica', style);
    doc.setFontSize(size);
    doc.text(String(text), x, y, { align });
    return y;
};

/**
 * Dibuja el header/metadatos del presupuesto. Los campos opcionales vacíos
 * se omiten del documento.
 */
const drawHeader = (doc, header) => {
    let y = 24;

    y = drawText(doc, 'PRESUPUESTO', MARGIN, y, {
        size: 20,
        style: 'bold',
    });
    y += 4;

    y = drawText(doc, String(header.company || ''), MARGIN, y, { size: 13, style: 'bold' });

    // Fecha alineada a la derecha del bloque de título.
    const dateText = header.date ? `Fecha: ${header.date}` : '';
    if (dateText) {
        drawText(doc, dateText, PAGE_WIDTH - MARGIN, 28, { size: 11, align: 'right' });
    }

    y += 10;

    if (header.clientName) {
        y = drawText(doc, `Cliente: ${header.clientName}`, MARGIN, y, { size: 11 }) + 6;
    }
    if (header.vehicle) {
        y = drawText(doc, `Vehículo: ${header.vehicle}`, MARGIN, y, { size: 11 }) + 6;
    }
    if (header.validity) {
        y = drawText(doc, `Validez: ${header.validity}`, MARGIN, y, { size: 11 }) + 6;
    }

    return y;
};

/**
 * Dibuja la tabla de line items y el encabezado de columnas.
 * Devuelve la coordenada Y final para continuar dibujando.
 */
const drawTable = (doc, items, startY) => {
    let y = startY;

    // Encabezado de columnas.
    doc.setFillColor(240, 240, 240);
    doc.rect(MARGIN, y - 5, TABLE_WIDTH, ROW_HEIGHT, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    COLUMNS.forEach((col) => {
        doc.text(col.label, col.x, y);
    });
    y += ROW_HEIGHT;

    // Filas de line items.
    doc.setFont('Helvetica', 'normal');
    items.forEach((item) => {
        doc.text(String(item.name), COLUMNS[0].x, y, { maxWidth: COLUMNS[0].width });
        doc.text(String(item.quantity), COLUMNS[1].x, y, { align: 'left' });
        doc.text(formatPrice(item.price), COLUMNS[2].x + COLUMNS[2].width, y, {
            align: 'right',
        });
        doc.text(formatPrice(item.subtotal), COLUMNS[3].x + COLUMNS[3].width, y, {
            align: 'right',
        });
        y += ROW_HEIGHT;
    });

    return y;
};

/**
 * Construye y guarda el documento PDF de un presupuesto.
 * @param {{ header: { company: string, date: string, clientName?: string, vehicle?: string, validity?: string }, items: Array<{ name: string, price: number, quantity: number, subtotal: number }> }} payload
 */
export const buildBudgetPdf = (payload) => {
    const { header, items } = payload;

    const doc = new jsPDF();

    // Título y metadatos.
    const afterHeaderY = drawHeader(doc, header);

    // Tabla de line items.
    const afterTableY = drawTable(doc, items, afterHeaderY);

    // Línea separadora y total.
    doc.setDrawColor(200, 200, 200);
    doc.line(MARGIN, afterTableY, MARGIN + TABLE_WIDTH, afterTableY);

    const totalY = afterTableY + 6;
    const total = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    drawText(doc, 'Total', COLUMNS[3].x, totalY, {
        size: 13,
        style: 'bold',
        align: 'left',
    });
    drawText(doc, formatPrice(total), COLUMNS[3].x + COLUMNS[3].width, totalY, {
        size: 13,
        style: 'bold',
        align: 'right',
    });

    // Nombre de archivo según cliente.
    const filename = header.clientName
        ? `presupuesto-${sanitizeFilename(header.clientName)}.pdf`
        : 'presupuesto.pdf';

    doc.save(filename);
};

export default buildBudgetPdf;
