# Proposal: Admin Combo Builder

## Intent

Build an admin module to create product combos/bundles with quantity assignment, combo pricing with discount validation, and localStorage persistence — giving admins a tool to define discounted packages while ensuring the combo price never falls below the base cost floor.

## Scope

### In Scope
- `useCombo` custom hook (combo state, pricing calculations, validation)
- `ComboBuilder` view (product picker, item list, pricing summary, combo price input)
- `ComboItem` component (line item card with quantity stepper + dual price display)
- `ComboSummary` component (sale total, base total, max discount, editable combo price)
- `combos.js` service (localStorage CRUD: load/save/add/delete)
- Router integration (lazy-loaded route under `admin/combos`)
- AdminPage header nav tabs to switch between Presupuestos and Combos
- Edge cases: null base_price warning, empty state, duplicate product handling

### Out of Scope
- Public-facing combo display / storefront integration
- Combo editing (only create + delete for now)
- Image thumbnails in combo items
- Backend / API persistence
- Combo PDF export
- Combo search / filtering in admin list

## Capabilities

### New Capabilities
- `admin-combo-builder`: Admin view for creating product combos with pricing validation and localStorage persistence

### Modified Capabilities
- `admin-budget-builder`: AdminPage header gets navigation tabs to switch between Presupuestos and Combos views (structural change only, no behavior change to BudgetBuilder itself)

## Approach

Follow the exact BudgetBuilder pattern: view directory under `src/pages/Admin/views/`, custom hook in `hooks/`, co-located CSS, BEM naming. Persistence via `localStorage` (key: `audiogem_combos`), a pattern consistent with how `AdminContext` uses `sessionStorage`.

### File Plan

| File | Action | Description |
|------|--------|-------------|
| `src/pages/Admin/hooks/useCombo.js` | **Create** | Hook managing combo editing state, pricing math, validation |
| `src/pages/Admin/views/ComboBuilder/ComboBuilder.jsx` | **Create** | Main orchestrator: picker + items + metadata form + summary |
| `src/pages/Admin/views/ComboBuilder/ComboBuilder.css` | **Create** | Styles mirroring BudgetBuilder layout |
| `src/pages/Admin/views/ComboBuilder/ComboItem.jsx` | **Create** | Line item card with quantity stepper |
| `src/pages/Admin/views/ComboBuilder/ComboItem.css` | **Create** | Styles mirroring BudgetItem |
| `src/pages/Admin/views/ComboBuilder/ComboSummary.jsx` | **Create** | Pricing summary with 4 rows + combo price input + save button |
| `src/pages/Admin/views/ComboBuilder/ComboSummary.css` | **Create** | Styles mirroring BudgetSummary |
| `src/services/combos.js` | **Create** | localStorage CRUD for combos |
| `src/router/index.jsx` | **Modify** | Add lazy import + route `admin/combos` with AdminPage shell |
| `src/pages/Admin/AdminPage.jsx` | **Modify** | Add nav tabs for "Presupuestos" / "Combos" using `NavLink` |
| `src/pages/Admin/AdminPage.css` | **Modify** | Style nav tabs |

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/router/index.jsx` | Modified | New lazy import `ComboBuilder`, new route child under `admin/presupuestos` |
| `src/pages/Admin/AdminPage.jsx` | Modified | Dynamic header with `NavLink` tabs, active state based on current route |
| `src/pages/Admin/AdminPage.css` | Modified | Tab navigation styles |
| `src/pages/Admin/views/ComboBuilder/` | New | 6 files (3 JSX + 3 CSS) |
| `src/pages/Admin/hooks/useCombo.js` | New | Custom hook |
| `src/services/combos.js` | New | Persistence service |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `base_price: null` on 5 products inflates max discount | High | Show ⚠️ warning icon on items with null base_price; treat null as 0 in calculations |
| AdminPage header refactor touches working code | Medium | Minimal change: wrap existing title in a nav structure, don't restructure layout |
| localStorage data loss on browser clear | Low | Combos are admin-only tooling; not mission-critical data. Could add export feature later |
| Product ID is array index (no stable ID) | Medium | Match products by reference equality or index — same approach BudgetBuilder uses (products matched by `id` which IS the array index from products-all.js) |

## Rollback Plan

1. Remove the `ComboBuilder` lazy import and route from `src/router/index.jsx`
2. Revert `AdminPage.jsx` and `AdminPage.css` to original state
3. Delete `src/pages/Admin/views/ComboBuilder/`, `src/pages/Admin/hooks/useCombo.js`, `src/services/combos.js`
4. No data migration needed (localStorage key is isolated)

## Dependencies

- Reuses existing `parsePrice`/`formatPrice` from `src/utils/price.js`
- Reuses `ALL_PRODUCTS` from `src/services/productsData.js`
- Reuses `Button` from `src/components/ui/Button.jsx`
- Reuses `useAdmin` from `src/context/AdminContext.jsx` (for conditional base_price display)
- No new npm dependencies

## Success Criteria

- [ ] Admin can search and add products to a combo with quantity
- [ ] Admin can set a combo name
- [ ] Pricing summary shows total sale, total base, max discount in real time
- [ ] Admin can set a combo price that validates against base total
- [ ] Combos persist in localStorage across page refreshes
- [ ] Admin can view saved combos and delete them
- [ ] Navigation between BudgetBuilder and ComboBuilder works via admin header tabs
- [ ] Products with null base_price show a warning indicator
- [ ] Empty combos cannot be saved
- [ ] Responsive layout works at 768px and 480px breakpoints
