/**
 * budgetPdf.js
 * Premium PDF budget builder using jsPDF.
 * Renders a professionally-designed document with:
 *  – Dark header band with company logo
 *  – Styled metadata section
 *  – Table with alternating row colors
 *  – Summary / totals block
 *  – Footer with branding
 *
 * Receives only public fields (name, price, quantity, subtotal);
 * `base_price` is never part of this interface.
 */

import { jsPDF } from 'jspdf';
import { formatPrice } from '../../../utils/price';
import logoSrc from '../../../assets/imagenes-audiogem/imagen1.png';

/* ─── Layout constants ────────────────────────────────────────── */
const MARGIN = 14;
const PAGE_WIDTH = 210; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/* ─── Color palette ───────────────────────────────────────────── */
const COLORS = {
    headerBg: [18, 18, 24],        // Near-black
    headerText: [255, 255, 255],    // White
    accent: [0, 150, 255],          // Electric blue
    accentDark: [0, 120, 210],      // Darker blue for contrast
    textPrimary: [30, 30, 40],      // Dark charcoal
    textSecondary: [100, 100, 115], // Muted gray
    tableHeaderBg: [30, 30, 44],    // Dark table header
    tableHeaderText: [255, 255, 255],
    tableRowEven: [245, 247, 252],  // Very light blue-gray
    tableRowOdd: [255, 255, 255],   // White
    tableBorder: [220, 225, 235],   // Subtle border
    totalBg: [235, 240, 250],       // Light blue tint
    divider: [200, 205, 215],       // Soft divider
    footerBg: [245, 247, 252],
    footerText: [120, 125, 135],
};

/* ─── Table column definitions ────────────────────────────────── */
const COL_PRODUCT_W = 82;
const COL_QTY_W = 22;
const COL_PRICE_W = 40;
const COL_SUBTOTAL_W = CONTENT_WIDTH - COL_PRODUCT_W - COL_QTY_W - COL_PRICE_W;

const COLUMNS = [
    { label: 'Producto', x: MARGIN, width: COL_PRODUCT_W, align: 'left' },
    { label: 'Cant.', x: MARGIN + COL_PRODUCT_W, width: COL_QTY_W, align: 'center' },
    { label: 'Precio Unit.', x: MARGIN + COL_PRODUCT_W + COL_QTY_W, width: COL_PRICE_W, align: 'right' },
    { label: 'Subtotal', x: MARGIN + COL_PRODUCT_W + COL_QTY_W + COL_PRICE_W, width: COL_SUBTOTAL_W, align: 'right' },
];

const ROW_HEIGHT = 9;
const TABLE_HEADER_HEIGHT = 10;

/* ─── Helpers ─────────────────────────────────────────────────── */

/**
 * Sanitize client name for safe filenames.
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
 * Load an image from URL/import and return a base64 data URL.
 */
const loadImageAsBase64 = (src) =>
    new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });

/**
 * Draw rounded rectangle.
 */
const roundedRect = (doc, x, y, w, h, r, style = 'F') => {
    doc.roundedRect(x, y, w, h, r, r, style);
};

/* ─── Section renderers ───────────────────────────────────────── */

/**
 * Draw the dark header band with logo and title.
 * Returns the Y coordinate after the header.
 */
const drawHeader = (doc, header, logoData) => {
    const headerHeight = 42;

    // Dark background band
    doc.setFillColor(...COLORS.headerBg);
    doc.rect(0, 0, PAGE_WIDTH, headerHeight, 'F');

    // Accent line at bottom of header
    doc.setFillColor(...COLORS.accent);
    doc.rect(0, headerHeight, PAGE_WIDTH, 1.2, 'F');

    // Logo (left side)
    if (logoData) {
        const logoH = 28;
        const logoW = logoH * 1.5; // approximate aspect ratio
        const logoY = (headerHeight - logoH) / 2;
        doc.addImage(logoData, 'PNG', MARGIN, logoY, logoW, logoH);
    }

    // Title "PRESUPUESTO" (right side)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...COLORS.headerText);
    doc.text('PRESUPUESTO', PAGE_WIDTH - MARGIN, 20, { align: 'right' });

    // Date below title
    if (header.date) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(180, 185, 200);
        doc.text(header.date, PAGE_WIDTH - MARGIN, 28, { align: 'right' });
    }

    // Budget number / company small text
    if (header.company) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(150, 155, 170);
        doc.text(header.company, PAGE_WIDTH - MARGIN, 35, { align: 'right' });
    }

    return headerHeight + 1.2;
};

/**
 * Draw the metadata cards (client, vehicle, validity).
 */
const drawMetadata = (doc, header, startY) => {
    let y = startY + 10;

    const fields = [
        { label: 'Cliente', value: header.clientName },
        { label: 'Vehículo', value: header.vehicle },
        { label: 'Validez', value: header.validity },
    ].filter((f) => f.value);

    if (fields.length === 0) return y;

    // Info card background
    const cardHeight = fields.length * 8 + 10;
    doc.setFillColor(248, 250, 255);
    doc.setDrawColor(...COLORS.tableBorder);
    doc.setLineWidth(0.3);
    roundedRect(doc, MARGIN, y, CONTENT_WIDTH, cardHeight, 3, 'FD');

    // Accent left border
    doc.setFillColor(...COLORS.accent);
    roundedRect(doc, MARGIN, y, 2.5, cardHeight, 1.2, 'F');

    y += 7;

    fields.forEach((field) => {
        // Label
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(`${field.label}:`, MARGIN + 8, y);

        // Value
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.textPrimary);
        doc.text(String(field.value), MARGIN + 35, y);

        y += 8;
    });

    return y + 6;
};

/**
 * Draw the items table with styled header and alternating rows.
 */
const drawTable = (doc, items, startY) => {
    let y = startY;

    // ─ Table header ─
    doc.setFillColor(...COLORS.tableHeaderBg);
    roundedRect(doc, MARGIN, y, CONTENT_WIDTH, TABLE_HEADER_HEIGHT, 2, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.tableHeaderText);

    const headerTextY = y + 7;
    COLUMNS.forEach((col) => {
        const textX =
            col.align === 'right'
                ? col.x + col.width - 3
                : col.align === 'center'
                    ? col.x + col.width / 2
                    : col.x + 3;
        doc.text(col.label, textX, headerTextY, { align: col.align });
    });

    // Move y past the header — rows start cleanly below
    y += TABLE_HEADER_HEIGHT + 1;

    // ─ Data rows ─
    items.forEach((item, idx) => {
        const isEven = idx % 2 === 0;

        // Row background (drawn FROM y, covering ROW_HEIGHT downward)
        doc.setFillColor(...(isEven ? COLORS.tableRowEven : COLORS.tableRowOdd));
        doc.rect(MARGIN, y, CONTENT_WIDTH, ROW_HEIGHT, 'F');

        // Bottom border
        doc.setDrawColor(...COLORS.tableBorder);
        doc.setLineWidth(0.2);
        doc.line(MARGIN, y + ROW_HEIGHT, MARGIN + CONTENT_WIDTH, y + ROW_HEIGHT);

        // Text baseline — vertically centered inside the row
        const textY = y + ROW_HEIGHT * 0.65;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(...COLORS.textPrimary);

        // Product name (may wrap)
        doc.text(String(item.name), COLUMNS[0].x + 3, textY, {
            maxWidth: COLUMNS[0].width - 6,
        });

        // Quantity (centered)
        doc.setFont('Helvetica', 'bold');
        doc.text(String(item.quantity), COLUMNS[1].x + COLUMNS[1].width / 2, textY, {
            align: 'center',
        });

        // Unit price (right-aligned)
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(...COLORS.textSecondary);
        doc.text(formatPrice(item.price), COLUMNS[2].x + COLUMNS[2].width - 3, textY, {
            align: 'right',
        });

        // Subtotal (right-aligned, bold)
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(...COLORS.textPrimary);
        doc.text(formatPrice(item.subtotal), COLUMNS[3].x + COLUMNS[3].width - 3, textY, {
            align: 'right',
        });

        y += ROW_HEIGHT;
    });

    return y;
};

/**
 * Draw the total summary block.
 */
const drawTotal = (doc, total, afterTableY) => {
    const y = afterTableY + 4;
    const totalBoxW = 80;
    const totalBoxH = 14;
    const totalBoxX = MARGIN + CONTENT_WIDTH - totalBoxW;

    // Total background
    doc.setFillColor(...COLORS.accent);
    roundedRect(doc, totalBoxX, y, totalBoxW, totalBoxH, 3, 'F');

    // "TOTAL" label
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL', totalBoxX + 6, y + 9.5);

    // Total value
    doc.setFontSize(13);
    doc.text(formatPrice(total), totalBoxX + totalBoxW - 6, y + 9.5, { align: 'right' });

    return y + totalBoxH + 6;
};

/**
 * Draw a subtle footer with branding.
 */
const drawFooter = (doc) => {
    const footerY = 275;
    const footerHeight = 22;

    // Divider line
    doc.setDrawColor(...COLORS.divider);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, footerY, MARGIN + CONTENT_WIDTH, footerY);

    // Footer text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.footerText);
    doc.text(
        'Audio Gem — Calidad · Potencia · Estilo',
        PAGE_WIDTH / 2,
        footerY + 6,
        { align: 'center' }
    );

    doc.setFontSize(7.5);
    doc.setTextColor(160, 165, 175);
    doc.text(
        'Los precios están sujetos a cambios sin previo aviso. Presupuesto válido según la fecha indicada.',
        PAGE_WIDTH / 2,
        footerY + 11,
        { align: 'center' }
    );

    // Page indicator
    doc.setFontSize(7);
    doc.setTextColor(180, 185, 195);
    doc.text('Página 1 de 1', PAGE_WIDTH - MARGIN, footerY + 17, { align: 'right' });
};

/* ─── Main export ─────────────────────────────────────────────── */

/**
 * Build and save the budget PDF document.
 * @param {{ header: { company: string, date: string, clientName?: string, vehicle?: string, validity?: string }, items: Array<{ name: string, price: number, quantity: number, subtotal: number }> }} payload
 */
export const buildBudgetPdf = async (payload) => {
    const { header, items } = payload;
    const doc = new jsPDF();

    // Load the logo image
    const logoData = await loadImageAsBase64(logoSrc);

    // 1. Header band with logo
    const afterHeaderY = drawHeader(doc, header, logoData);

    // 2. Client / vehicle / validity metadata
    const afterMetaY = drawMetadata(doc, header, afterHeaderY);

    // 3. Items table
    const afterTableY = drawTable(doc, items, afterMetaY);

    // 4. Total
    const total = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    drawTotal(doc, total, afterTableY);

    // 5. Footer
    drawFooter(doc);

    // Save
    const filename = header.clientName
        ? `presupuesto-${sanitizeFilename(header.clientName)}.pdf`
        : 'presupuesto.pdf';

    doc.save(filename);
};

export default buildBudgetPdf;
