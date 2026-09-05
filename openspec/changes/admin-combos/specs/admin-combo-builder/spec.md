# Admin Combo Builder Specification

## Purpose

Admin-only combo builder at route `admin/combos`: select products with quantities, enter a discount amount that is validated against the maximum possible discount (sale − base), compute the final combo price automatically (sale − discount), and persist combos via localStorage. Mirrors BudgetBuilder's two-column layout and patterns.

## Data Schema

```
Combo {
  id:         string   — crypto.randomUUID()
  name:       string   — admin-entered, required, non-empty
  items:      ComboItem[]
  discount:   number   — admin-entered discount in ARS numeric domain
  comboPrice: number   — final price, derived as totalSalePrice − discount
  createdAt:  string   — ISO 8601 timestamp
}

ComboItem {
  productId: number — index into ALL_PRODUCTS array
  quantity:  number — >= 1
}
```

Derived at runtime from items + catalog: `totalSalePrice`, `totalBasePrice`, `maxDiscount`, `parsedDiscount`, `comboPrice`, `isDiscountValid`.

Storage key: `audiogem_combos` in `localStorage`. Combos saved before the discount model (without a `discount` field) remain readable; the modal falls back to `totalSalePrice − comboPrice` when `discount` is absent.

## UI Layout

Two-column grid (same as BudgetBuilder). Left: product picker + combo item cards. Right: combo name input, pricing summary (sticky), saved combos list. BEM naming, CSS variables, dark theme.

Each combo card shows: product name, unit sale price, unit base price, quantity stepper, line subtotal, line base subtotal, null base_price warning, remove button.

Pricing summary rows: Total venta, Total base, Descuento máximo, Descuento a aplicar (input), Precio final del combo (auto-calculado), Ganancia, validation message, save button. The discount input is the only manual price entry: the final price is always `totalSalePrice − discount`.

## Requirements

| ID | Requirement | Scenarios |
|----|-------------|-----------|
| REQ-1 | Combo Creation | 4 |
| REQ-2 | Combo Pricing | 3 |
| REQ-3 | Discount Validation and Final Price Calculation | 4 |
| REQ-4 | Combo Persistence | 3 |
| REQ-5 | Combo Management | 3 |
| REQ-6 | Product Picker | 4 |
| REQ-7 | Null Base Price Handling | 2 |
| REQ-8 | Responsive Layout | 3 |

### Requirement: REQ-1 — Combo Creation

The system SHALL let the admin create a new combo by selecting products and assigning quantities.

#### Scenario: Add product to combo

- GIVEN the combo builder is open with an empty item list
- WHEN the admin selects product X from the picker
- THEN a combo item for X is added with quantity 1

#### Scenario: Duplicate product increments quantity

- GIVEN the combo contains product X with quantity 2
- WHEN the admin selects product X again
- THEN the quantity of the existing X item increments to 3

#### Scenario: Set combo name

- GIVEN the combo has at least one item
- WHEN the admin types a name in the name input
- THEN the combo name is stored in local state

#### Scenario: Remove item from combo

- GIVEN the combo has three items
- WHEN the admin clicks the remove button on item B
- THEN item B is removed and pricing recalculates

### Requirement: REQ-2 — Combo Pricing

The system SHALL compute and display pricing in real time as items and quantities change.

#### Scenario: Sale and base totals

- GIVEN items: product A (price `$70.000`, base `$50.000`) qty 2, product B (price `$30.000`, base `$20.000`) qty 1
- THEN totalSalePrice = `$170.000`, totalBasePrice = `$120.000`, maxDiscount = `$50.000`

#### Scenario: Null base_price treated as zero

- GIVEN an item with product C (`base_price: null`, price `$50.000`) qty 1
- THEN totalBasePrice contribution is `$0` and maxDiscount includes the full `$50.000`

#### Scenario: Empty combo shows zero

- GIVEN the combo has no items
- THEN all pricing rows display `$0`

### Requirement: REQ-3 — Discount Validation and Final Price Calculation

The system SHALL let the admin enter a discount amount manually and SHALL derive the final combo price as `totalSalePrice − discount`. The discount SHALL be validated so the sale never loses money: `0 <= discount <= maxDiscount` (where `maxDiscount = totalSalePrice − totalBasePrice`).

#### Scenario: Valid discount within range

- GIVEN totalBasePrice = `$100.000` and totalSalePrice = `$200.000`
- WHEN the admin enters discount = `$50.000`
- THEN the final price is calculated as `$150.000`, the discount is accepted and the save button is enabled

#### Scenario: Discount above max discount blocked

- GIVEN totalSalePrice = `$200.000` and totalBasePrice = `$100.000` (maxDiscount = `$100.000`)
- WHEN the admin enters discount = `$120.000`
- THEN a validation error is displayed, the final price would be `$80.000` (below base), and the save button is disabled

#### Scenario: Discount at max discount still allowed

- GIVEN totalBasePrice = `$100.000` and totalSalePrice = `$200.000`
- WHEN the admin enters discount = `$100.000`
- THEN the final price equals the base total (`$100.000`), the discount is accepted (zero-profit sale), and the save button is enabled

#### Scenario: Final price always derived

- GIVEN the admin enters discount = `$30.000` on a combo with totalSalePrice = `$200.000`
- THEN the displayed final price is `$170.000` and the admin cannot edit it directly

### Requirement: REQ-4 — Combo Persistence

The system SHALL persist combos to `localStorage` under key `audiogem_combos` and reload them on page load.

#### Scenario: Combo survives page refresh

- GIVEN the admin saved a combo
- WHEN the page is refreshed
- THEN the saved combo appears in the saved combos list

#### Scenario: localStorage unavailable

- GIVEN localStorage is blocked or full
- WHEN the admin clicks save
- THEN a user-facing warning is displayed and the combo is not saved

#### Scenario: Multiple combos persisted

- GIVEN the admin saves combo A, then combo B
- WHEN the page is refreshed
- THEN both A and B appear in the saved combos list

### Requirement: REQ-5 — Combo Management

The system SHALL display all saved combos and allow deletion.

#### Scenario: View saved combos

- GIVEN three combos are saved in localStorage
- WHEN the combo builder loads
- THEN all three combos are listed in the saved combos section

#### Scenario: Delete a combo

- GIVEN two saved combos A and B
- WHEN the admin clicks delete on combo A
- THEN combo A is removed from the list and localStorage; combo B remains

#### Scenario: Long combo name truncation

- GIVEN a saved combo with a 60-character name
- WHEN displayed in the saved combos list
- THEN the name is truncated with ellipsis

### Requirement: REQ-6 — Product Picker

The system SHALL provide a searchable product picker with category filtering to add products to the combo.

#### Scenario: Search by product name

- GIVEN the catalog has a product "Modulo Full Auto"
- WHEN the admin types "full" in the search input
- THEN matching products appear in the dropdown results

#### Scenario: Filter by category

- GIVEN the catalog has products in categories "Alarmas" and "Accesorios"
- WHEN the admin selects the "Alarmas" category filter
- THEN only products in "Alarmas" appear in the dropdown

#### Scenario: Empty search results

- GIVEN the admin types "xyznonexistent" in the search input
- WHEN the dropdown renders
- THEN a "no results" message is shown

#### Scenario: Select from dropdown

- GIVEN the search dropdown shows product "Modulo Full Auto"
- WHEN the admin clicks on it
- THEN the product is added to the combo and the dropdown closes

### Requirement: REQ-7 — Null Base Price Handling

The system SHALL handle products with `base_price: null` gracefully without errors.

#### Scenario: Warning indicator on null base_price

- GIVEN product C has `base_price: null`
- WHEN product C is added to the combo
- THEN a warning icon is displayed on the line item card

#### Scenario: Null base_price in calculations

- GIVEN product C has `base_price: null` and price `$50.000`, quantity 1
- THEN the line base subtotal displays `$0` and contributes `$0` to totalBasePrice

### Requirement: REQ-8 — Responsive Layout

The system SHALL adapt the combo builder layout across desktop, tablet, and mobile breakpoints.

#### Scenario: Desktop layout (1024px+)

- GIVEN the viewport is 1024px or wider
- THEN the two-column grid is displayed side by side

#### Scenario: Tablet layout (768px)

- GIVEN the viewport is 768px
- THEN columns stack vertically and component sizing scales down

#### Scenario: Mobile layout (480px)

- GIVEN the viewport is 480px
- THEN the layout is single-column with compact component sizing

## Non-functional Requirements

- **Performance**: Pricing recalculation MUST complete within a single render cycle (derived state, no debounce needed for <75 items).
- **Accessibility**: All interactive elements (steppers, buttons, inputs) MUST be keyboard navigable. Pricing summary MUST use semantic markup.
- **Browser**: MUST work in Chrome, Firefox, Safari, and Edge (latest 2 versions). `localStorage` is the only storage mechanism.
