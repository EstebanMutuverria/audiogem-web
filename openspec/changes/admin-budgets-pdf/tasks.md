# Tasks: Admin Budget Builder with PDF Download

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1300–1700 (8 new JSX/CSS + 2 modified) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 4 stacked PRs (below) |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Pure domain: `useBudget` + `budgetPdf` + `jspdf` dep | PR 1 | `node -e` one-liner on parsePrice/budgetPdf; `npm run build` | `npm run dev` → build a budget, confirm totals | Revert `package.json` + delete `hooks/useBudget.js` + `utils/budgetPdf.js` |
| 2 | Admin shell + route gate: `AdminPage`, `AdminRoute`, router | PR 2 | `npm run build`; `npm run lint` | `/admin/presupuestos` unauth → modal; auth → shell | Revert router diff + delete `AdminPage.jsx/.css` + `AdminRoute.jsx` |
| 3 | `BudgetItem` + `BudgetSummary` (line row + total + download control) | PR 3 | `npm run build`; `npm run lint` | Budget builder: steppers, subtotal, empty-state | Delete `BudgetItem` + `BudgetSummary` + `.css` |
| 4 | `BudgetBuilder` orchestrator: picker + metadata form + wire build/download | PR 4 | `npm run build`; `npm run lint`; manual QA flow | Full flow → click 'Aceptar o Crear presupuesto', verify PDF | Delete `BudgetBuilder` + `.css` |
| — | Whole change | Single tracker | — | — | Remove `Admin/` dir, revert router + `package.json` |

## Phase 1: Foundation (PR 1)

- [x] 1.1 Add `jspdf` to `package.json` (`npm install jspdf`).
- [x] 1.2 Create `src/pages/Admin/hooks/useBudget.js`: `{lineItems, budgetTotal, addItem, updateQuantity, removeItem, clearBudget, isEmpty}`; add-new qty1, existing-increments, qty<=0 removes, total=ΣparsePrice(price)*qty (builder R3,R5,R6).
- [x] 1.3 Create `src/pages/Admin/utils/budgetPdf.js`: `buildBudgetPdf(payload)` — public fields only, `formatPrice` on all prices, sanitized filename (accents NFD-strip, spaces→`_`), omitted empty optionals, `doc.save()` (export R1,R2,R4,R5,R6).

## Phase 2: Admin shell + gate (PR 2)

- [x] 2.1 Create `src/pages/Admin/AdminPage.jsx` + `.css`: admin header + content wrapper.
- [x] 2.2 Create `src/components/admin/AdminRoute.jsx`: gate on `useAdmin().isAdmin`; render builder or `AdminLoginModal` (builder R1-R2).
- [x] 2.3 Modify `src/router/index.jsx`: lazy `admin/presupuestos` child under `RootLayout` wrapped in `AdminRoute` (builder R1).

## Phase 3: Line item + summary (PR 3)

- [ ] 3.1 Create `src/pages/Admin/views/BudgetBuilder/BudgetItem.jsx` + `.css`: steppers `+`/`-`, remove, subtotal, admin cost column hidden when `base_price` null (builder R2,R3,R4,R5).
- [ ] 3.2 Create `src/pages/Admin/views/BudgetBuilder/BudgetSummary.jsx` + `.css`: total via `formatPrice`, empty-state message, download button 'Aceptar o Crear presupuesto' disabled when empty (builder R6; export R1).

## Phase 4: Orchestrator (PR 4)

- [ ] 4.1 Create `src/pages/Admin/views/BudgetBuilder/BudgetBuilder.jsx` + `.css`: product picker from `ALL_PRODUCTS`, drives `useBudget`, metadata form (company/date required; clientName/vehicle/validity optional), wires `buildBudgetPdf` to download (builder R7; export R1,R2,R3).
- [ ] 4.2 Manual QA: accented `Pérez` filename + render, `$USD 55` edge via parsePrice, no `base_price` in PDF.

## Phase 5: Verification

- [ ] 5.1 Run `npm run build` (config verify command) — clean.
- [ ] 5.2 Run `npm run lint` — no new errors.
- [ ] 5.3 Manual route/flow check against builder + export scenarios.

## Open Design Questions → Resolve in Apply

- (a) PDF prices use existing `formatPrice` (export R6) — confirmed in design.
- (b) `base_price:null` lines: hide admin cost column (mirror `ProductCard.jsx` line 70 `isAdmin && base_price`); never pass to PDF.
- (c) Filename sanitization: NFD-strip accents + spaces→`_` (e.g. `presupuesto-Juan_Perez.pdf`).
- (d) `$USD 55` price: `parsePrice`→55; treat as low-cost line.
- (e) **No test runner in `package.json`.** Recommendation: do NOT add Vitest this change — repo has zero test infra, `verify` config uses `npm run build`, and repo rules forbid unnecessary deps. Verify with `npm run build` + `npm run lint` + manual QA + throwaway `node -e` logic checks. Defer test infra to a separate change if desired.
