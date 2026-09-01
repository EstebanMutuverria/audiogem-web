# Design: Admin Budget Builder with PDF Export

## Technical Approach

Add an admin-only route `admin/presupuestos` under `RootLayout` that renders an admin budget builder composed of a catalog product picker, quantity line items (steppers), a metadata form, and a running total. State lives in a dedicated `useBudget` hook (numeric-domain prices via `parsePrice`/`formatPrice`), decoupled from `CartContext`. A `budgetPdf.js` module builds a `jspdf` document from **public fields only** and triggers `doc.save()` on the labeled button 'Aceptar o Crear presupuesto'. Route gating reuses `AdminLoginModal` via a wrapper that checks `useAdmin().isAdmin`.

## Architecture Decisions

### Decision: Independent `useBudget` hook instead of reusing CartContext

| Option | Tradeoff | Decision |
|---|---|---|
| Reuse CartContext | Couples admin quotes to customer cart; localStorage persistence; stock/badge guards unwanted; opens cart drawer on add | ✗ |
| Local `useBudget` state hook | Private, no persistence, no coupling, mirrors cart line-item shape | ✓ |

**Rationale**: Admin quotes are transient, admin-scoped documents with no stock/WhatsApp/checkout semantics. Reusing CartContext would bleed admin budgets into the customer cart and localStorage (`audiogem_cart_items`). `useBudget` keeps the same `{ product, quantity }` line-item shape (mirroring `CartContext.jsx`) but as a page-local hook.

### Decision: `useState` + `useCallback`/`useMemo` over `useReducer`

**Choice**: `useState` for `lineItems` + individual `setLineItems` callbacks; `useMemo` derived `budgetTotal`.
**Alternatives**: `useReducer` — more boilerplate for a single slice of state.
**Rationale**: Matches existing `CartContext.jsx` style; actions (add/update/remove/clear) are simple enough for callbacks. Guarded reducer replaces it only if actions grow.

### Decision: `jspdf` as the only new dependency

**Choice**: `jspdf` (current stable), via `npm install jspdf`.
**Alternatives**: `pdf-lib`, native `window.print`.
**Rationale**: Explicit one-click download requirement rules out `window.print` (no true download). `jspdf`'s native `doc.save()` + bundled Helvetica WinAnsi covers es-AR accents (é/í/ñ/á/ü) without font embedding. No extra libs.

### Decision: Admin shell reuses `RootLayout`; `AdminPage` adds admin header only

**Choice**: Route is a child of the existing `RootLayout`, reusing Navbar/Footer; `AdminPage.jsx` renders an admin header + `<Outlet/>`-style content. Client-side routing change only — no shell/process boundary.
**Alternatives**: Separate admin layout with its own navbar.
**Rationale**: Keeps nav/footer/footer-shell consistent and is the least invasive change consistent with the repo conventions.

## Data Flow

    BudgetBuilder (useBudget) ── product id → lineItems: [{product, quantity}]
         │  parsePrice(price)*qty  per line
         ├── BudgetItem ──+/-/remove → useBudget callbacks
         └── BudgetSummary ── sum(subtotals) → budgetTotal
    BudgetBuilder metadata form → {clientName?, vehicle?, validity?, company, date}
         (clientName, vehicle, validity optional; company + date required)
    'Aceptar o Crear presupuesto' → budgetPdf.buildPdf(publicItems, meta) → doc.save(filename)
         (buildPdf receives ONLY {name, price, quantity}; base_price never passed)

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Admin/AdminPage.jsx` + `.css` | Create | Admin shell (header + `<Outlet/>`) |
| `src/pages/Admin/hooks/useBudget.js` | Create | Budget state hook (add/update/remove/clear, derived total) |
| `src/pages/Admin/utils/budgetPdf.js` | Create | jsPDF builder — public fields only, saves file |
| `src/pages/Admin/views/BudgetBuilder/BudgetBuilder.jsx` + `.css` | Create | Orchestrator: picker + list + metadata + download |
| `src/pages/Admin/views/BudgetBuilder/BudgetItem.jsx` + `.css` | Create | Line row: steppers, subtotal, remove |
| `src/pages/Admin/views/BudgetBuilder/BudgetSummary.jsx` + `.css` | Create | Total + empty state + download control |
| `src/components/admin/AdminRoute.jsx` | Create | Gate wrapper (isAdmin ? builder : modal) |
| `src/router/index.jsx` | Modify | Lazy `admin/presupuestos` child under RootLayout |
| `package.json` | Modify | Add `jspdf` |

## Interfaces / Contracts

```js
// useBudget.js — returns { lineItems, budgetTotal, addItem, updateQuantity, removeItem, clearBudget, isEmpty }
useBudget() => {
  lineItems: [{ product: Object, quantity: number }],
  budgetTotal: number,            // numeric domain, sum of parsePrice(price)*qty
  addItem(product),               // existing id → quantity+1; else push qty 1
  updateQuantity(productId, qty), // qty<=0 → remove; else set
  removeItem(productId),
  clearBudget(),
  isEmpty: boolean,
}

// budgetPdf.js
buildBudgetPdf(payload) // doc.save(filename)
// payload = { header: {company, date, clientName?, vehicle?, validity?}, items: [{name, price:number, quantity:number, subtotal:number}] }
//   clientName, vehicle, validity are OPTIONAL (may be empty); company and date are required.
// filename = clientName ? `presupuesto-${clientName-sanitized}.pdf` : 'presupuesto.pdf'
// formatPrice() applied to all price fields before drawing; base_price is not a parameter.
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | useBudget per spec: add-new qty1, add-existing increments, decrement-to-1 removes, remove, total sum, parsePrice-0 default | Vitest if added; else manual/build — see Risk below. |
| Unit | budgetPdf no-cost-leak: buildPdf receives only public fields; assert no `base_price`/cost string; filename sanitized; accents preserved | Pure-function assertion + filename unit test |
| Integration | Empty budget → download disabled; non-admin → modal shown | Manual route check |
| E2E | Route gate, steppers, download | Manual (no runner in repo) |

## Threat Matrix

N/A — no shell, subprocess, VCS/PR automation, executable-file, or process-integration boundary. The "routing" here is client-side React Router navigation only; no command/subprocess authority is introduced.

## Migration / Rollout

No migration required (no persistence, no schema). Rollback: remove lazy route + `Admin/` dir + revert `package.json`.

## Open Questions / Validator Confirmation

- [ ] **`formatPrice` in PDF**: spec R-5 says prices in PDF use `formatPrice` (e.g. `$140.000`). Confirm implementer formats numeric domains with the existing util, not raw numbers.
- [ ] **base_price null lines**: several catalog products have `base_price: null`. Confirm on-screen admin cost column hides for null (mirror `ProductCard.jsx` `isAdmin && base_price`), and PDF builder never references it.
- [ ] **Filename sanitization for accents/spaces**: `Juan Pérez` → `presupuesto-Juan_Perez.pdf`; confirm underscore replacement strategy for spaces and NFD stripping for `é`/`ñ`.
- [ ] **`$USD 55` price edge**: one product price is `'$USD 55'`; `parsePrice` yields `55`. Confirm that's intended (low-cost line) or filter.
- [ ] **No test runner present** (`package.json` has none); unit plans assume one is added for this change or verification is manual. Confirm.
