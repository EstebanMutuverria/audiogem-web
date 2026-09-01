# Budget PDF Export Specification

## Purpose

Define the one-click client-side PDF export of a budget via `jspdf` (`doc.save`), including correct filename, line-item content, metadata, no cost leakage, and correct rendering of Spanish accented characters.

## Requirements

### Requirement: One-click download

The system SHALL expose a download button labeled 'Aceptar o Crear presupuesto' that generates and downloads the budget PDF as a device download on a single click.

#### Scenario: Download budget PDF

- GIVEN the budget has at least one line item and metadata
- WHEN the admin clicks 'Aceptar o Crear presupuesto'
- THEN a PDF file is generated and saved/downloaded to the device

#### Scenario: Download with empty budget

- GIVEN the budget has no line items
- THEN the download does not produce a PDF (button disabled/blocked)

### Requirement: Filename

The system SHALL name the downloaded PDF using the client/quote metadata when available and fall back to a default generic name.

#### Scenario: Filename from client

- GIVEN the client name is "Juan Pérez"
- WHEN the PDF is downloaded
- THEN the filename includes the client name (e.g. `presupuesto-Juan_Perez.pdf`)

#### Scenario: Default filename

- GIVEN no client name was provided
- WHEN the PDF is downloaded
- THEN a default filename (e.g. `presupuesto.pdf`) is used

### Requirement: PDF line-item content

The downloaded PDF SHALL contain, per line item: product name, quantity, unit price, and line subtotal; and SHALL contain the budget total and the budget metadata (client name, date, company header/footer).

#### Scenario: Content complete

- GIVEN a budget with one line item name, quantity 2, unit price `$70.000`, and metadata client/date/header
- WHEN the PDF is downloaded
- THEN the PDF contains the product name, quantity 2, unit price `$70.000`, line subtotal `$140.000`, total `$140.000`, client name, date, and company header/footer

### Requirement: No cost leakage

The system SHALL NOT render `base_price` (cost) into the PDF. The PDF SHALL contain only the public price and derived totals.

#### Scenario: Base price absent from PDF

- GIVEN a product with `price '$70.000'` and `base_price '$50.000'`
- WHEN the budget PDF is downloaded
- THEN `base_price` (`$50.000`) and the cost concept do not appear anywhere in the PDF
- AND only the public price `$70.000` appears

### Requirement: Spanish accents render correctly

The system SHALL use a font/encoding that renders Spanish accented characters (é, í, ñ, á, ü) correctly in the PDF.

#### Scenario: Accented characters render

- GIVEN a product/client name containing characters such as `Pérez`, `Ítem`, `año`, `presupuesto`
- WHEN the PDF is downloaded
- THEN those accented characters are rendered correctly and not garbled

### Requirement: Numeric price formatting in PDF

The system SHALL format all prices in the PDF using the existing `formatPrice` util (ARS format with `$` and thousands separators), derived from numeric-domain values.

#### Scenario: Formatted prices in PDF

- GIVEN a line subtotal of 140000 in the numeric domain
- WHEN rendered in the PDF
- THEN it appears as `$140.000`
