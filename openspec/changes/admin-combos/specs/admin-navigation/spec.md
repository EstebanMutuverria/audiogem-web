# Admin Navigation Delta

## ADDED Requirements

### Requirement: Admin view navigation tabs

The system SHALL render navigation tabs in the AdminPage header to switch between "Presupuestos" and "Combos" views. The active tab SHALL reflect the current route.

#### Scenario: Navigate to Combos

- GIVEN the admin is on the Presupuestos view
- WHEN the admin clicks the "Combos" tab
- THEN the router navigates to `/admin/combos` and the Combos tab is visually active

#### Scenario: Navigate to Presupuestos

- GIVEN the admin is on the Combos view
- WHEN the admin clicks the "Presupuestos" tab
- THEN the router navigates to `/admin/presupuestos` and the Presupuestos tab is visually active

#### Scenario: Direct URL access

- GIVEN the admin navigates directly to `/admin/combos` via URL
- THEN the Combos tab is displayed as active on load

### Requirement: Admin header dynamic title

The system SHALL display the active view name in the AdminPage header, reflecting the current route.

#### Scenario: Header shows current view

- GIVEN the admin is on `/admin/combos`
- THEN the header text displays "Combos"

#### Scenario: Header updates on navigation

- GIVEN the admin navigates from Presupuestos to Combos
- THEN the header text changes from "Presupuestos" to "Combos"
