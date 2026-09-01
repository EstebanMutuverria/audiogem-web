# Admin Budget Builder Specification

## Purpose

Define the admin-only budget builder screen at route `admin/presupuestos`: catalog product picker, cart-like quantity line items, running subtotal/total, metadata form, and empty-state behavior. Prices are handled in the numeric domain and displayed with the existing `formatPrice` util.

## Requirements

### Requirement: Admin-only access gate

The system SHALL gating the `admin/presupuestos` route on `isAdmin` from `AdminContext`. When an unauthenticated or non-admin user navigates to `admin/presupuestos`, the system SHALL NOT render the builder and SHALL prompt the admin login flow (login modal) instead of granting access.

#### Scenario: Authenticated admin accesses the builder

- GIVEN `isAdmin` is true (admin logged in)
- WHEN the user navigates to `/admin/presupuestos`
- THEN the budget builder is rendered for that user

#### Scenario: Non-admin user attempts to access the route

- GIVEN `isAdmin` is false or the user is not authenticated
- WHEN the user navigates to `/admin/presupuestos`
- THEN the builder is not rendered
- AND the admin login modal is shown and access is denied until successful login

### Requirement: Add product to budget

#### Scenario: Add a product not already in the budget

The system SHALL let the admin add a product from the catalog to the budget as a line item.

- GIVEN the budget builder is open and contains no line item for product X
- WHEN the admin selects product X
- THEN a line item for X is added with quantity 1

#### Scenario: Add a product already present

- GIVEN the budget already contains a line item for product X with quantity 2
- WHEN the admin selects product X again
- THEN the quantity of the existing X line item increments (to 3) instead of adding a duplicate row

### Requirement: Quantity steppers

The system SHALL provide `+`/`-` steppers per line item that adjust quantity by 1.

#### Scenario: Increment quantity

- GIVEN a line item with quantity 1
- WHEN the admin presses `+`
- THEN the line quantity becomes 2 and the line subtotal is recalculated

#### Scenario: Decrement to zero removes line

- GIVEN a line item with quantity 1
- WHEN the admin presses `-`
- THEN the line is removed from the budget (quantity cannot go below 1)

### Requirement: Remove line item

The system SHALL provide a remove action that deletes a line item regardless of its quantity.

#### Scenario: Remove a line item

- GIVEN a budget with two line items
- WHEN the admin removes one of them
- THEN the line disappears and the total is recalculated

### Requirement: Line subtotal and total

The system SHALL compute each line subtotal as `parsePrice(unit price) * quantity` and the budget total as the sum of all line subtotals, all in the numeric domain, formatted via `formatPrice`.

#### Scenario: Line subtotal math

- GIVEN a product with unit price `$70.000` and quantity 3
- THEN the line subtotal is `$210.000`

#### Scenario: Total is sum of lines

- GIVEN two lines of `$70.000` x 1 and `$100.000` x 2
- THEN the budget total is `$270.000`

### Requirement: Empty-state behavior

The system SHALL display an empty-state message and SHALL disable/guard the metadata form and download when the budget has no line items.

#### Scenario: Empty budget

- GIVEN the budget has no line items
- THEN an empty-state message is shown
- AND the PDF download action is unavailable (disabled or blocked)

#### Scenario: Budget with line items

- GIVEN the budget has at least one line item
- THEN the empty-state message is hidden and the download action is available

### Requirement: Budget metadata fields

The system SHALL capture the following budget metadata fields: **company** and **date** (required), plus **client name**, **vehicle**, and **validity** (all optional). These fields feed the PDF header/metadata area. Optional fields SHALL be omitted from the PDF when left empty.

#### Scenario: Capture metadata

- GIVEN the admin has entered company, date, client name, vehicle, and validity
- WHEN the budget is downloaded
- THEN those values are reflected in the PDF header/metadata area

#### Scenario: Optional metadata left empty

- GIVEN the admin has entered only company and date, leaving client name, vehicle, and validity empty
- WHEN the budget is downloaded
- THEN the PDF header shows company and date, and the empty optional fields are omitted
