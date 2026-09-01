# Change: admin-budgets-pdf

Admin-only screen for building price quotes (presupuestos) cart-style, with metadata and a one-click PDF download.

## Change Summary

| Attribute | Value |
|-----------|-------|
| Change name | `admin-budgets-pdf` |
| Status | Spec written |
| Scope | New admin route `admin/presupuestos` gated by `isAdmin`; budget builder (product picker, quantities, remove, subtotal/total); metadata form (client, date, header/footer); one-click PDF export via `jspdf` |
| Out of scope | No backend/persistence, no email, no taxes/discounts/rates, no customer-facing view |
| New dependencies | `jspdf` (only new dependency) |

## Specs

| Domain | Type | File |
|--------|------|------|
| Admin Budget Builder | New | `specs/admin-budget-builder/spec.md` |
| Budget PDF Export | New | `specs/budget-pdf-export/spec.md` |

## Key Decisions

- Route gated by `isAdmin` from `AdminContext`; unauthenticated `admin/presupuestos` prompts admin login via the login modal and does not render the builder.
- Independent `useBudget` state (NOT `CartContext`), reusing the `{ product, quantity }` line-item shape conceptually.
- Prices parsed/calculated in the numeric domain via `parsePrice`; displayed via `formatPrice`.
- `base_price` (cost) shown on-screen only for admin; NEVER rendered into the PDF.
- PDF uses jsPDF's bundled standard fonts (Helvetica/WinAnsi) so Spanish accents (é, í, ñ) render correctly.

## Coverage

- [x] Admin access gating / unauthenticated route behavior
- [x] Budget builder: add product, quantity steppers, remove, line subtotal, total
- [x] Empty-state behavior
- [x] Budget metadata (client name, date, header/footer)
- [x] PDF generation: one-click download, filename, content, no cost leakage, Spanish accents
- [x] Numeric price handling (parse/format, totals math)
