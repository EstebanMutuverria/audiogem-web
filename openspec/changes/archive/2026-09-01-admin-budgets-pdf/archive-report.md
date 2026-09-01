# Archive Report: Admin Budget Builder with PDF Download

## Change Summary

The `admin-budgets-pdf` change added an admin-only screen to build price quotes (presupuestos) with catalog product line items, quantity steppers, running subtotal/total, and quote metadata, then download the result as a PDF on a single click. This replaces the manual Excel/email quote-building process. The change is a pure client-side SPAA feature: no backend, no persistence, no shared URLs.

- Capabilities delivered: `admin-budget-builder` (new) and `budget-pdf-export` (new).
- Route: `admin/presupuestos` (lazy child under `RootLayout`, gated by `isAdmin`).
- PDF strategy: `jspdf` (only new dependency) with native `doc.save()`; standard Helvetica WinAnsi font covers Spanish accents; `base_price` (cost) is stripped and never passed to the PDF generator.
- Metadata decision (confirmed and incorporated during apply): `clientName`, `vehicle`, `validity` optional; `company` and `date` required. Optional fields omitted from the PDF when empty.

## Files Delivered

New files (implemented and verified, lint-clean):
- `src/pages/Admin/AdminPage.jsx` + `.css` — admin shell (header + content).
- `src/pages/Admin/hooks/useBudget.js` — budget state hook (add/update/remove/clear, derived total).
- `src/pages/Admin/utils/budgetPdf.js` — jsPDF builder (public fields only, sanitized filename, `doc.save()`).
- `src/pages/Admin/views/BudgetBuilder/BudgetBuilder.jsx` + `.css` — orchestrator (picker + metadata form + download).
- `src/pages/Admin/views/BudgetBuilder/BudgetItem.jsx` + `.css` — line row (steppers, subtotal, remove).
- `src/pages/Admin/views/BudgetBuilder/BudgetSummary.jsx` + `.css` — total + empty state + download control.
- `src/components/admin/AdminRoute.jsx` — route gate wrapper (`isAdmin ? builder : login modal`).

Modified files:
- `src/router/index.jsx` — added lazy `admin/presupuestos` child under `RootLayout`, wrapped in `AdminRoute`.
- `package.json` — added `jspdf`.

## Spec Delta Synced

Both delta specs promoted from the change folder into the stable main specs baseline (mechanical copy, byte-verified):

| Domain | Action | Destination |
|--------|--------|-------------|
| `admin-budget-builder` | Created (new capability) | `openspec/specs/admin-budget-builder/spec.md` (7 requirements, 10 scenarios) |
| `budget-pdf-export` | Created (new capability) | `openspec/specs/budget-pdf-export/spec.md` (6 requirements, 9 scenarios) |

Neither main spec existed before this change; the delta specs ARE full specs, so they were copied verbatim rather than merged. All requirements preserved (ADDED only, no MODIFIED/REMOVED/RENAMED).

## Task Completion

All 13/13 tasks complete (`[x]`) per the persisted `tasks.md`, including the 3 Phase 5 verification tasks (5.1 build, 5.2 lint, 5.3 manual route/flow check). Task Completion Gate passed — no unchecked implementation tasks remain. Final-state authority: this is the terminal snapshot for the change; the 13/13 count is consistent across `tasks.md`, `verify-report.md`, and commit history. No post-verify code changes were made.

## Verification Outcome

- **Verdict: PASS** (`verify-report.md`, evidence `sha256:86a927...`)
- Requirements covered: 13/13; scenarios: 21/21.
- Build: `npm run build` → **PASS**, exit 0, `✓ built in 4.08s`, 872 modules transformed, no errors.
- Lint: `npm run lint` → 184 errors / 1 warning, **all pre-existing** in unrelated files. New files (7 new + `AdminRoute.jsx`) targeted lint: **0 errors, 0 warnings**.
- Working tree clean on `main` (per verify snapshot).
- Commits: `7fd43f1`, `147f8f5`, `0a20186`, `20262f1` on `main`.

Per the Final-State Authority hierarchy, the verification outcome above is carried from the native review/verify receipts and the persisted `verify-report.md` as the terminal snapshot. The `verify-report.md` is the authoritative terminal record for this change; no post-verify fixes were made, so no stale intermediate claims need reconciliation.

## Risks / Follow-ups

- **No automated test runner** in the repo (`package.json` has none — decision `(e)` in `tasks.md`). Verification used `npm run build` + `npm run lint` (new-file clean) + manual QA + throwaway `node -e` logic checks. Spec scenarios are proven by source inspection + manual QA, not an automated suite. **Follow-up**: a separate change is recommended to add permanent automated coverage (e.g. Vitest) for `useBudget`/`budgetPdf`.
- **Pre-existing lint errors** in unrelated files (`StarBorder.jsx`, `TextShimmer.jsx`, `AdminLoginModal.jsx`, `Navbar.jsx`, `AdminContext.jsx`, `router/index.jsx:24` in the pre-existing `withSuspense` helper, and the `whatsapp-webhook/` Node subproject) remain unfixed per scope, not introduced by this change. **Follow-up**: a separate cleanup change.
- **Navbar admin link decision**: the risk "Admin route harder to find" was mitigated by the proposal (navbar "Soy Admin" -> `/admin/presupuestos` when `isAdmin`). Note: the navbar link pointing to the admin budget route is a discovery-related consideration; confirm the `Navbar.jsx` link wiring on the AdminContext-driven `isAdmin` path if not already addressed in the broader nav work.

## Archive Metadata

- Archived at: `openspec/changes/archive/2026-09-01-admin-budgets-pdf/`
- Synchronized main specs: `openspec/specs/admin-budget-builder/spec.md`, `openspec/specs/budget-pdf-export/spec.md`
- Delivered files: 9 new source files + `jspdf` dependency + router change (see File Changes above).
- Task/verify counts: tasks 13/13 complete; verify verdict PASS; build PASS; new-file lint clean.
- Change cycle: complete (proposal → spec → design → tasks → apply → verify → archive).
