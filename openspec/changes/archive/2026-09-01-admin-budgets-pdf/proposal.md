# Proposal: Admin Budget Builder with PDF Download

## Intent

Admins manually build price quotes (presupuestos) in Excel/email today. This change adds an admin-only screen to assemble product line items (cart-like), enter client/quote metadata, and download the result as a PDF on the device. Solves the operational cost and inconsistency of hand-built quotes and gives a one-click "Create budget / Aceptar" download.

## Scope

### In Scope

- New admin route `admin/presupuestos` (lazy child under RootLayout, gated by `isAdmin`)
- Budget builder: product picker, line-item quantities (+/-), remove line, running subtotal/total (reusing price utils + cart-like pattern)
- Client/quote metadata form: client name, vehicle, date, validity, company header
- PDF generator producing a real one-click downloadable PDF (native, printed or generated) of the budget
- `src/pages/Admin/` layout: `AdminPage` + `views/BudgetBuilder/` + `utils/budgetTotals.js` + `utils/budgetPdf.js`
- Route-gating behavior + redirect to login modal when unauthenticated

### Out of Scope

- No backend, persistence, or shared budget URLs (static SPA, no API added)
- No email/SMS sending of budgets (client-only PDF for now)
- No currency/rate management, discounts, taxes, or IVA handling (single price column)
- No customer-facing budget view; admin-only

## Capabilities

> No existing main specs exist — this is a new capability.

### New Capabilities

- `admin-budget-builder`: Admin screen to build a budget from catalog products with quantity line items and quote metadata.
- `budget-pdf-export`: Client-side generation and download of a budget PDF.

### Modified Capabilities

- None (no existing specs).

## Approach

**PDF strategy — one-click download with `jspdf`.** Although the repo avoids unnecessary dependencies, the user explicitly requires a button that downloads a PDF. `window.print` is not a true download and breaks the UX asked for, so the zero-dep option is rejected; the dep is justified by an explicit requirement. Choose `jspdf` (Option B) — mature, small, native `doc.save()`, simpler ARS/es-AR layout than pdf-lib. Spanish accents embedded via bundled standard fonts (Helvetica WinAnsi covers é/í/ü/ñ) — verify at design.

Line items reuse the CartContext line-item shape conceptually but as **independent budget state** (local hook `useBudget`) to avoid coupling the customer cart with admin quotes. Prices shown used = public `price`; `base_price` (cost) shown on-screen only in admin column and **never** rendered into the PDF.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/router/index.jsx` | Modified | Add lazy `admin/presupuestos` child + gate |
| `src/pages/Admin/AdminPage.jsx` + `.css` | New | Admin shell/layout |
| `src/pages/Admin/views/BudgetBuilder/*` | New | Builder UI, line items, summary |
| `src/pages/Admin/utils/budgetTotals.js` | New | Total/margins calc (parsePrice/formatPrice) |
| `src/pages/Admin/utils/budgetPdf.js` | New | jsPDF document builder |
| `src/components/layout/AdminLoginModal.jsx` | Modified | Reuse for route-gating auth prompt |
| `package.json` | Modified | Add `jspdf` |
| `src/utils/price.js`, `src/services/products-all.js` | Used (unchanged) | Reuse parsing/formatting + catalog |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Cost (`base_price`) leaks into customer-facing PDF | High | Column shown on screen only; PDF builder strips `base_price`; unit test asserts absence |
| Spanish accents garbled in PDF | Med | Use standard-font WinAnsi mapping; snapshot-test representative chars |
| Dependency bloat vs repo rule | Med | Document explicit requirement; pin `jspdf`; no extra libs |
| Admin route harder to find | Med | Navbar "Soy Admin" links to `/admin/presupuestos` when `isAdmin` |

## Rollback Plan

Remove the lazy route + `Admin/` dir + revert `package.json`; delete unused import. Fully reversible — no persistence, no schema.

## Dependencies

- Add `jspdf` (only new dependency).

## Success Criteria

- [ ] Admin can build a budget and download a PDF via one click.
- [ ] Downloaded PDF contains line items, quantities, subtotals, total, and client/quote fields.
- [ ] Inferred `base_price`/cost never appears in the PDF.
- [ ] Unauthenticated `/admin/*` redirects to the admin login flow.
