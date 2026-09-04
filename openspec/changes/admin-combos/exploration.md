## Exploration: Admin Combo Builder

### Current State

The admin module (`src/pages/Admin/`) has a single view: **BudgetBuilder** — a product picker + line item list + PDF quote generator. The shell (`AdminPage.jsx`) provides a header + `<Outlet />` pattern, and routes are children of `admin/presupuestos` in the router.

**Product catalog**: 75 hardcoded products in `src/services/products-all.js`. Each product has `price` (sale string), `base_price` (cost string, **5 products are null**), `category`, `brand`, and no `id` field — products are identified by array index position.

**Existing patterns**:
- Custom hooks in `src/pages/Admin/hooks/` (e.g., `useBudget.js`)
- Utils in `src/pages/Admin/utils/` (e.g., `budgetPdf.js`)
- Views in `src/pages/Admin/views/{ViewName}/` with co-located CSS
- BEM naming, CSS variables, dark theme
- Price handling: `parsePrice(str)` strips non-digits, `formatPrice(num)` adds "$" + thousands separator
- No persistence layer in admin (no localStorage, no backend)

### Affected Areas

| File | Impact | Why |
|------|--------|-----|
| `src/router/index.jsx` | **Modified** | Add route for combo builder view under admin shell |
| `src/pages/Admin/AdminPage.jsx` | **Modified** | Header title needs to be dynamic or show nav tabs for multiple views |
| `src/pages/Admin/AdminPage.css` | **Modified** | Style admin nav tabs |
| `src/services/products-all.js` | Read-only | Products sourced from here; no changes needed |
| `src/utils/price.js` | Read-only | Reuse `parsePrice`/`formatPrice`; no changes needed |
| `src/pages/Admin/views/ComboBuilder/` | **New** | Main view directory |
| `src/pages/Admin/hooks/useCombo.js` | **New** | State hook for combo items |
| `src/services/combos.js` | **New** | Combo data module (persistence layer) |

### Data Model Design

**Combo item** (line item within a combo):
```
{ productId: number, quantity: number }
```

**Combo** (persisted):
```
{
  id: string,           // crypto.randomUUID() or "combo-{timestamp}"
  name: string,         // admin-given name, e.g. "Pack Full Auto"
  items: [
    { productId: number, quantity: number }
  ],
  comboPrice: number,   // final price set by admin (in domain number)
  createdAt: string     // ISO timestamp
}
```

**Derived at runtime** (from combo items + ALL_PRODUCTS):
- `totalSalePrice` = sum of `parsePrice(product.price) × quantity` per item
- `totalBasePrice` = sum of `parsePrice(product.base_price) × quantity` per item (null treated as 0)
- `maxDiscount` = `totalSalePrice − totalBasePrice`
- Admin-set `comboPrice` must satisfy: `comboPrice >= totalBasePrice`

**Persistence**: New file `src/services/combos.js` with `loadCombos()`, `saveCombos(combos)`, `addCombo(combo)`, `deleteCombo(id)`, using `localStorage` keyed as `audiogem_combos`. This follows the same pattern as `AdminContext` using `sessionStorage` — but `localStorage` because combos survive tab close.

### UI/UX Approach

**Layout**: Two-column grid matching BudgetBuilder pattern (products column + summary column).

**Left column — Product picker + combo items**:
- Reuse the same search-and-select pattern from BudgetBuilder (search input → dropdown → add button)
- Combo items displayed as cards showing: product name, unit price, base price (admin-only), quantity stepper, line total (sale price × qty), line base total, remove button
- Empty state: dashed border message like BudgetBuilder

**Right column — Combo metadata + pricing summary**:
- **Name field** (required): text input for combo name
- **Saved combos list**: accordion or list of previously saved combos, each with name, item count, combo price, delete button
- **Pricing summary card** (sticky):
  - Total venta (sale): sum of sale subtotals
  - Total base (cost): sum of base subtotals
  - Descuento máximo: difference (sale − base)
  - Precio del combo: editable input (admin sets final price)
  - Validation message if price < base total
  - "Guardar combo" button (disabled if empty or invalid price)

**Header**: AdminPage header shows "Combos" title. Navigation between BudgetBuilder and ComboBuilder via tab links in the header.

### State Management

**`useCombo` hook** — local state, no Context needed (same pattern as `useBudget`):

```js
{
  comboItems: Array<{ product, quantity }>,
  comboName: string,
  comboPrice: number,
  // derived
  totalSalePrice: number,
  totalBasePrice: number,
  maxDiscount: number,
  isPriceValid: boolean,
  isEmpty: boolean,
  // actions
  addItem, removeItem, updateQuantity, clearCombo,
  setComboName, setComboPrice,
}
```

**Saved combos**: managed via `loadCombos()`/`saveCombos()` from `src/services/combos.js`, lifted to the ComboBuilder component level (not in the hook — hook is for the current editing session only).

### Pricing/Discount Calculations

```
For each combo item:
  saleSubtotal = parsePrice(product.price) * quantity
  baseSubtotal = parsePrice(product.base_price || "$0") * quantity

totalSalePrice = sum(saleSubtotal)
totalBasePrice = sum(baseSubtotal)
maxDiscount = totalSalePrice - totalBasePrice

Validation:
  isPriceValid = comboPrice >= totalBasePrice && comboPrice <= totalSalePrice
  (Allowing comboPrice == totalSalePrice means no discount — valid but pointless)
```

**Note on base_price null**: 5 products have `base_price: null`. `parsePrice(null)` returns 0, so those products contribute 0 to the base total. This means they appear as "free" from a cost perspective — the admin must be aware this inflates the apparent max discount. The UI should show a warning indicator (e.g., ⚠️ icon) on items where base_price is null.

### Edge Cases

1. **Empty combo**: Cannot save; "Guardar" button disabled; pricing summary shows $0
2. **Products with null base_price**: base_total is treated as 0 for that line; warning icon shown
3. **Quantity 0 or below**: remove the item (same as BudgetBuilder pattern)
4. **Duplicate product add**: increment quantity of existing item (same as BudgetBuilder)
5. **Combo price == sale total**: valid, means 0% discount — allowed
6. **Combo price < base total**: blocked with inline error message
7. **Very long combo name**: truncate with ellipsis in saved combos list
8. **Product removed from catalog**: if a product is deleted from products-all.js, existing combos referencing it show a "producto no encontrado" placeholder
9. **localStorage full/unavailable**: catch errors in saveCombos, show user-facing warning

### Impact on Existing Modules

- **Router**: Add new lazy-loaded import and child route under `admin/combos`
- **AdminPage**: Needs to support a secondary nav (tabs for "Presupuestos" / "Combos"). The header title becomes dynamic based on route, or shows tab links.
- **No impact on BudgetBuilder**: completely independent view
- **No impact on public-facing pages**: combos are admin-only, no storefront integration

### Approach Comparison

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **A: localStorage persistence** | Simple, no backend needed, follows project pattern | Data lost on browser clear, no cross-device sync | Low |
| **B: Hardcoded combos.js** | Consistent with products pattern, version-controlled | Every save overwrites file, no runtime persistence | Low |
| **C: In-memory only** (no persistence) | Simplest | Combos lost on page refresh — unacceptable UX | Very Low |

**Recommendation**: **Approach A** (localStorage). It's the only option that provides real persistence without a backend. Combos are admin-side data that don't need version control.

### Risks

- **base_price null on 5 products** could mislead admins into thinking they have more discount margin than they actually do — mitigate with warning indicators
- **localStorage size limit** (~5MB) is more than sufficient for combos, but unsaved combos could be lost if browser data is cleared — mitigate with a "save" confirmation pattern
- **AdminPage header refactor** touches existing working code — mitigate by keeping the change minimal (add tabs, don't restructure)

### Ready for Proposal

Yes — the data model, UI approach, state management, persistence strategy, and edge cases are well-defined. Ready for proposal phase.
