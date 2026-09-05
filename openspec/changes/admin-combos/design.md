# Design: Admin Combo Builder

## Technical Approach

Mirror the BudgetBuilder pattern exactly: view directory under `src/pages/Admin/views/ComboBuilder/`, custom hook in `hooks/`, co-located CSS, BEM naming. New persistence service in `src/services/combos.js` using `localStorage` (key: `audiogem_combos`). AdminPage shell gets NavLink tabs for route-based navigation. All pricing derived from `parsePrice`/`formatPrice` in `src/utils/price.js`. No new dependencies.

## Architecture Decisions

| Decision | Options | Tradeoff | Decision |
|----------|---------|----------|----------|
| State management | Custom hook vs Context | Context adds indirection with no sharing benefit; hook matches useBudget | **Custom hook** (`useCombo`) |
| Persistence | localStorage vs hardcoded | Hardcoded is version-controlled but overwrites on save; localStorage is runtime-persistent | **localStorage** (`audiogem_combos` key) |
| Product matching | Array index vs reference | Products lack stable IDs; BudgetBuilder uses `product.id` (the array index) — follow same convention | **Array index** (`product.id`) |
| AdminPage header | Static title vs NavLink tabs | Static breaks when two views exist; NavLink keeps active state per route with zero JS | **NavLink tabs** |
| Price input type | text input with parse vs number input | Number input has native range constraints but poor ARS formatting; text input + parse matches project pattern | **Text input** (raw number, format on display) |

## Data Flow

```
ALL_PRODUCTS ──→ ComboBuilder (picker state) ──→ useCombo.addItem()
                                                       │
                                                 comboItems[]
                                                       │
                              ┌──────────────────────────┤
                              ▼                          ▼
                        ComboItem[]              useMemo derivations
                     (quantity stepper)     totalSalePrice, totalBasePrice
                              │              maxDiscount, isPriceValid
                              ▼                          │
                        ComboSummary ◄────────────────────┘
                   (4 pricing rows + comboPrice input)
                              │
                              ▼  onSave()
                        combos.js saveCombos() ──→ localStorage
```

**Persistence trigger**: Explicit save only (button click). No auto-save — admins must confirm combo name + price intentionally.

**Validation loop**: `discount` state → derived `parsedDiscount` and `comboPrice = totalSalePrice − parsedDiscount` → `useMemo` checks `parsedDiscount <= maxDiscount` → `isDiscountValid` boolean → ComboSummary shows error message + disables save button.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/services/combos.js` | Create | localStorage CRUD: `loadCombos()`, `saveCombos(list)`, `addCombo(combo)`, `deleteCombo(id)` |
| `src/pages/Admin/hooks/useCombo.js` | Create | State hook: items, name, discount input, derived pricing, actions |
| `src/pages/Admin/views/ComboBuilder/ComboBuilder.jsx` | Create | Orchestrator: picker + items list + metadata + summary |
| `src/pages/Admin/views/ComboBuilder/ComboBuilder.css` | Create | Two-column grid mirroring BudgetBuilder layout |
| `src/pages/Admin/views/ComboBuilder/ComboItem.jsx` | Create | Line card: name, dual prices, qty stepper, line subtotals, remove |
| `src/pages/Admin/views/ComboBuilder/ComboItem.css` | Create | Mirrors BudgetItem.css with added base-price row |
| `src/pages/Admin/views/ComboBuilder/ComboSummary.jsx` | Create | 6 pricing rows (venta, base, descuento max, descuento input, precio final auto-calc, ganancia) + validation + save button |
| `src/pages/Admin/views/ComboBuilder/ComboSummary.css` | Create | Mirrors BudgetSummary.css with extra rows |
| `src/router/index.jsx` | Modify | Lazy import ComboBuilder, add `admin/combos` child route |
| `src/pages/Admin/AdminPage.jsx` | Modify | Replace static title with NavLink tabs for "Presupuestos"/"Combos" |
| `src/pages/Admin/AdminPage.css` | Modify | Add `.admin-page__nav` and `.admin-page__tab` styles |

## Interfaces / Contracts

### `combos.js` service

```js
// localStorage key
const STORAGE_KEY = 'audiogem_combos';

// Returns Combo[] — empty array on error or empty storage
export function loadCombos() {}

// Writes full Combo[] to localStorage. Returns true on success, false on error.
export function saveCombos(combos) {}

// Convenience: load → push → save. Returns updated Combo[] or null on failure.
export function addCombo(combo) {}

// Convenience: load → filter → save. Returns updated Combo[] or null on failure.
export function deleteCombo(id) {}
```

### `useCombo` hook return shape

```js
{
  comboItems: Array<{ product: Object, quantity: number }>,
  comboName: string,
  discount: string,             // raw input string
  comboPrice: number,           // derived: totalSalePrice - parsePrice(discount)
  totalSalePrice: number,
  totalBasePrice: number,
  maxDiscount: number,
  isDiscountValid: boolean,
  isEmpty: boolean,
  addItem: (product) => void,
  removeItem: (productId) => void,
  updateQuantity: (productId, qty) => void,
  setComboName: (name) => void,
  setDiscount: (discountStr) => void,
  clearCombo: () => void,
}
```

`discount` is stored as the raw string input; `parsedDiscount` is parsed to a number and `comboPrice` is derived as `totalSalePrice - parsedDiscount`. `isDiscountValid` requires a non-empty input with `0 <= parsedDiscount <= maxDiscount`. `totalSalePrice` and `totalBasePrice` are `useMemo` derived from `comboItems` (same pattern as `budgetTotal` in `useBudget`).

### Combo data shape (persisted)

```js
{
  id: crypto.randomUUID(),
  name: string,
  items: Array<{ productId: number, quantity: number }>,
  discount: number,   // parsed numeric domain (admin-entered)
  comboPrice: number, // derived numeric: totalSale - discount
  createdAt: string,  // new Date().toISOString()
}
```

### AdminPage modification detail

Current static `<h1>Presupuestos</h1>` replaced with:

```jsx
<nav className="admin-page__nav">
  <NavLink to="/admin/presupuestos" className={({isActive}) => `admin-page__tab ${isActive ? 'admin-page__tab--active' : ''}`}>
    Presupuestos
  </NavLink>
  <NavLink to="/admin/combos" className={({isActive}) => `admin-page__tab ${isActive ? 'admin-page__tab--active' : ''}`}>
    Combos
  </NavLink>
</nav>
```

The `h1` is removed; the label "Panel de administración" stays. Tabs inherit heading font size for visual weight.

### Router modification detail

Add after the existing `admin/presupuestos` route block:

```jsx
{
  path: 'admin/combos',
  element: <AdminPage />,
  children: [
    {
      index: true,
      element: withSuspense(() => (
        <AdminRoute>
          <ComboBuilder />
        </AdminRoute>
      )),
    },
  ],
},
```

Add lazy import: `const ComboBuilder = lazy(() => import('../pages/Admin/views/ComboBuilder/ComboBuilder'));`

## Component Design Notes

**ComboItem** differs from BudgetItem by showing dual price rows (sale + base) and a warning icon for null `base_price` items. The `isAdmin` guard from `useAdmin` controls base-price visibility (same pattern as BudgetItem).

**ComboSummary** has 6 pricing rows (Total venta, Total base, Descuento máximo, Descuento a aplicar input, Precio final auto-calculado, Ganancia) plus a validation error message. The save button is disabled when `isEmpty || !isDiscountValid || !comboName.trim()`.

**ComboBuilder** owns saved-combos state (`savedCombos` from `loadCombos()` on mount) — not in the hook, since the hook models the current editing session only. `addCombo()` from the service is called on save; `deleteCombo()` on list item delete.

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| 1024px+ | Two-column grid: `minmax(0, 1.6fr) minmax(0, 1fr)` |
| 768px | Single column, sticky side becomes static |
| 480px | Reduced padding, stacked picker row |

Matches BudgetBuilder's existing `@media` breakpoints exactly.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. New `localStorage` key (`audiogem_combos`) is isolated. Rollback: delete new files, revert 3 modified files, remove route.

## Open Questions

- None — all technical decisions resolved from exploration and proposal phases.
