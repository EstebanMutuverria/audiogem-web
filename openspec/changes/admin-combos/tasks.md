# Tasks: Admin Combo Builder

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1010 |
| 400-line budget risk | High (800-line review budget) |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

```text
Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High
```

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | `combos.js` localStorage service | PR 1 | `npm run build` + manual DevTools localStorage check | Open admin login, call `loadCombos()` in console | Delete file; no other consumers |
| 2 | `useCombo.js` state hook | PR 1 | `npm run build`; hook not yet consumed | N/A — no UI wired yet (additive only) | Delete file; no consumers |
| 3 | `ComboItem` component + CSS | PR 1 | `npm run build` | N/A — imported only by WU5 (additive) | Delete component; unimported |
| 4 | `ComboSummary` component + CSS | PR 1 | `npm run build` | N/A — imported only by WU5 (additive) | Delete component; unimported |
| 5 | `ComboBuilder` orchestrator + CSS | PR 2 | `npm run build`; manual add/validate/save flow | Navigate to `/admin/combos` after WU6 | Remove route import in router |
| 6 | Router + AdminPage nav tabs | PR 2 | `npm run build`; click tabs at `/admin/presupuestos` | Manual nav between both views | Revert router + AdminPage |

## Phase 1: Foundation (WU1–WU4 — PR 1)

- [x] 1.1 `src/services/combos.js` — `loadCombos()`, `saveCombos()`, `addCombo()`, `deleteCombo()` using `localStorage` key `audiogem_combos`; try/catch returning `false`/`null` on error. Accept: build passes; console calls work.
- [x] 1.2 `src/pages/Admin/hooks/useCombo.js` — state (`comboItems`, `comboName`, `comboPrice` string) + `useMemo` derivations (`totalSalePrice`, `totalBasePrice`, `maxDiscount`, `isPriceValid`, `isEmpty`); actions `addItem` (duplicate increments qty), `removeItem`, `updateQuantity` (≤0 removes), `setComboName`, `setComboPrice`, `clearCombo`. Mirror `useBudget`. Accept: build passes.
- [x] 1.3 `src/pages/Admin/views/ComboBuilder/ComboItem.jsx` + `.css` — line card: name, unit sale price, base price (via `useAdmin().isAdmin`, null → `$0` + ⚠️ warning), qty stepper, sale/base subtotals, remove. Accept: build passes; renders correct totals.
- [x] 1.4 `src/pages/Admin/views/ComboBuilder/ComboSummary.jsx` + `.css` — 4 pricing rows (venta, base, descuento max, editable combo price input), inline validation error when `!isPriceValid`, save button disabled when `isEmpty || !isPriceValid || !name.trim()`. Accept: build passes.

## Phase 2: Orchestration + Wiring (WU5–WU6 — PR 2)

- [x] 2.1 `src/pages/Admin/views/ComboBuilder/ComboBuilder.jsx` + `.css` — two-column grid (1.6fr/1fr), product picker (search + dropdown, click-outside close, empty results message), item list, saved-combos state (`loadCombos()` on mount), name field, `addCombo()` on save, `deleteCombo()` on list delete, truncation of long names, responsive breakpoints 768px/480px. Accept: build passes; manual add→save→refresh flow persists.
- [x] 2.2 `src/router/index.jsx` + `src/pages/Admin/AdminPage.jsx` + `AdminPage.css` — lazy import `ComboBuilder`, add `admin/combos` route with `AdminPage` shell + `AdminRoute`; replace static `<h1>` with `NavLink` tabs "Presupuestos"/"Combos" (active class from `isActive`). Accept: build passes; nav works both directions + direct URL.

## Phase 3: Verification

- [ ] 3.1 Run `npm run build`; verify no errors.
- [ ] 3.2 Manual scenario pass: REQ-1 through REQ-8 behaviors (add/duplicate/name/remove, pricing, validation bounds, persistence/refresh, delete, picker search/filter/empty, null base warning, responsive 1024/768/480).
