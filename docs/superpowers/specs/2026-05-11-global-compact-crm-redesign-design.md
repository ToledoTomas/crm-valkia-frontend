# Global Compact CRM Redesign Design

## Goal

Extend the compact minimal premium direction from `Productos` to the rest of the CRM. The app should feel like a focused daily operations tool for a small clothing business, with fewer visible sections, fewer metrics, and simpler workflows.

## Scope

This design covers:

- Main navigation.
- `Dashboard`.
- `Ventas`.
- `Nueva venta`.
- `Clientes`.
- `Nuevo cliente`.
- `Editar cliente`.
- `Configuracion`.
- Temporary handling for `Stock` and `Reportes`.

This design does not cover backend changes, advanced analytics, new reporting data, product image upload, auth redesign, or complete removal of backend stock/report endpoints.

## Product Direction

The CRM should expose only the workflows that matter now:

1. Review the business at a glance.
2. Sell products.
3. Manage products and stock from `Productos`.
4. Manage customers.
5. Manage account/session basics.

Advanced reporting, standalone stock operations, margin analysis, cost analysis, customer classification, and long informational copy should be hidden or secondary for now.

## Visual Direction

Reuse the visual language already introduced in `Productos`:

- Font: `Geist`.
- Background: off-white.
- Text: graphite.
- Borders: warm neutral gray.
- Accent: restrained dark green.
- Shape: compact, mostly `rounded-xl` / `rounded-2xl`.
- Shadows: minimal.
- Tables: dense but readable.
- Forms: two-column where useful on desktop, stacked on mobile.

Avoid returning to beige/brown dominant styling, large cards, oversized headings, and dashboard-like visual noise.

## Navigation

Visible sidebar/mobile menu items:

- `Dashboard`
- `Ventas`
- `Productos`
- `Clientes`
- `Configuracion`

Hidden menu items:

- `Stock`
- `Reportes`

Route handling:

- `/stock` should redirect to `/productos`.
- `/reportes` should redirect to `/dashboard`.

This keeps existing URLs from becoming broken while removing those sections from normal navigation.

## Dashboard

The dashboard becomes a compact status page, not an analytics center.

Keep:

- Low-height page header.
- Four compact indicators:
  - Ventas hoy.
  - Ventas del mes.
  - Productos con atencion.
  - Clientes nuevos.

Remove or hide for now:

- Revenue/cost/profit charts.
- Top product ranking.
- Profit/cost comparison.
- Margin-heavy copy.
- Decorative or oversized metric cards.

The dashboard should answer: "How is today/month going?" without requiring the user to interpret charts.

## Ventas

### Sales List

The sales list should be compact and operational.

Header:

- Title: `Ventas`.
- Short helper text.
- Primary action: `Nueva venta`.

Table columns:

- Venta
- Cliente
- Fecha
- Items
- Total
- Acciones

Hide from the main list:

- Ganancia.
- Costo.

Detail dialog:

- Keep a detail dialog for viewing items.
- Show total and items.
- Do not show cost or profit metrics in the dialog for now.

Delete/anulacion:

- Keep confirmation dialog.
- Use concise copy.
- Keep stock-revert behavior unchanged.

### Nueva Venta

New sale should focus on speed:

- Compact header with back button.
- Customer selector, optional.
- Product search.
- Variant selection.
- Quantity.
- Add to cart.
- Cart table.
- Total.
- Confirm sale.

Remove or hide:

- Cost.
- Profit.
- Profit per unit.
- Large success dialog.

After successful sale:

- Show toast.
- Navigate back to `Ventas`.

## Clientes

### Customer List

The customer list should be compact.

Header:

- Title: `Clientes`.
- Short helper text.
- Primary action: `Nuevo cliente`.

Controls:

- Search input only.

Table columns:

- Cliente
- Contacto
- Compras
- Acciones

Hide from the main list:

- Total gastado.
- Clasificacion.
- Ultima compra.

Those fields can remain in backend data and can be reintroduced later when the business has enough history.

### Nuevo Cliente

Use a simple form:

- Nombre.
- Email.
- Telefono.

After successful creation:

- Show toast.
- Navigate back to `Clientes`.

Remove:

- Large success dialog.
- Extra account/customer metadata.

### Editar Cliente

Mirror the add form:

- Nombre.
- Email.
- Telefono.

After successful update:

- Show toast.
- Navigate back to `Clientes`.

Use the existing customer API wrappers. Keep this scoped to frontend presentation and the current customer fields.

## Configuracion

Configuration should be small and practical.

Keep:

- Account/session section.
- User role/name if currently static.
- Logout action.
- Minimal app version line.

Remove or reduce:

- Long "Acerca de" copy.
- Marketing-style explanation of the product.
- Large two-column informational layout if it feels heavier than the content.

## Stock And Reports

`Stock` is removed from navigation because stock now lives in `Productos`.

`Reportes` is removed from navigation because the current page is mostly placeholder content. It can return later when there is real report data.

Implementation should not delete backend API wrappers unless they directly block the build. Prefer route redirection and menu removal for this pass.

## Components And Boundaries

Keep changes local and focused:

- Navigation changes in `Sidebar`; `MobileSidebar` should inherit the same menu through `Sidebar`.
- Dashboard simplification in its page file.
- Sales list and new-sale simplification in their page files.
- Customer list/form/edit simplification in their existing files.
- Config simplification in its page file.
- Route redirects in the existing `stock/page.tsx` and `reportes/page.tsx` files.

Do not create a large shared abstraction unless repeated UI becomes difficult to maintain. Products already established enough visual direction to repeat simple header/card/table patterns directly.

## Data Flow

Backend contracts remain unchanged.

Dashboard:

- Continue using existing dashboard API wrappers.
- Render only the subset needed for compact indicators.

Ventas:

- Continue using `getInvoices`, `deleteInvoice`, and `createInvoice`.
- Keep stock-revert behavior on delete.
- Continue searching customers/products through existing APIs.

Clientes:

- Continue using `getCustomers`, `searchCustomers`, `createCustomer`, `getCustomerById`, `updateCustomer`, and `deleteCustomer`.

Stock/Reports:

- Do not call their data APIs in redirected pages.

## Validation And Error Handling

Use existing validation behavior where it is already adequate.

Required validation:

- New sale requires at least one cart item.
- New sale quantity must be greater than zero and cannot exceed available stock.
- New customer requires name, email, and phone if the current form requires them.
- Edit customer should preserve existing required fields.

Use compact toast feedback for create/update/delete success and failure.

## Testing And Verification

Verification should include:

- `npm run build`.
- `npm run lint`.
- Manual check of visible navigation.
- Manual check that `Stock` and `Reportes` are hidden from sidebar and mobile sidebar.
- Manual check that `/stock` redirects to `/productos`.
- Manual check that `/reportes` redirects to `/dashboard`.
- Manual check of `Dashboard`, `Ventas`, `Nueva venta`, `Clientes`, `Nuevo cliente`, `Editar cliente`, and `Configuracion`.
- Mobile width check for navigation and compact tables/forms.

## Acceptance Criteria

- Navigation shows only Dashboard, Ventas, Productos, Clientes, and Configuracion.
- `/stock` redirects to `/productos`.
- `/reportes` redirects to `/dashboard`.
- Dashboard is compact and no longer shows advanced charts/rankings.
- Ventas list no longer shows cost/profit as primary data.
- Nueva venta no longer shows cost/profit information and uses toast + navigation after success.
- Clientes list no longer focuses on total spent/classification/last purchase.
- Nuevo/Edit cliente use simple compact forms and toast feedback.
- Configuracion is reduced to account/session essentials.
- `npm run build` passes.
- `npm run lint` has no errors.
