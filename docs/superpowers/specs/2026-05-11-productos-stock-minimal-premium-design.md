# Productos Stock Minimal Premium Design

## Goal

Redesign the product area around basic stock control for a young clothing business with a small catalog. The experience should feel compact, professional, and easy to operate, without presenting advanced commercial analytics before the business needs them.

## Scope

This design covers:

- `Productos` list page.
- `Nuevo producto` page.
- `Editar producto` page.
- Shared product and variant form presentation.
- Visual system updates needed for these screens.

This design does not cover backend changes, new product image upload, reporting, purchase workflows, barcode scanning, or advanced profitability tools.

## Product Direction

The product section should answer three questions quickly:

1. What products are loaded?
2. How much stock does each product have?
3. Which products need stock attention?

The first version should avoid treating the page like a full catalog audit desk. Cost, profit, and margin are not part of the main stock workflow for now. If those fields remain technically required by current APIs or existing variant data, they should be handled quietly with defaults or secondary placement rather than surfaced as primary UI.

## Visual Direction

Use a minimal premium software style:

- Font: `Geist`.
- Background: subtle off-white.
- Text: graphite / warm black.
- Borders: warm neutral gray.
- Accent: restrained dark green.
- Shape: sober radii, closer to `rounded-xl` and `rounded-2xl` than large pill cards.
- Shadows: light and rare.

Avoid the current dominant cream/brown palette, large rounded containers, oversized metric cards, and heavy atelier language. The result should feel more like a polished operations tool than a brand landing page.

## Products List Page

The list page becomes a compact stock control view.

### Header

Use a low-height header with:

- Title: `Productos`.
- Short helper text focused on stock control.
- Compact summary text, for example: `12 productos cargados - 2 requieren atencion`.
- Primary action: `Nuevo producto`.

Do not use four large summary cards. The business has a small catalog, so oversized metrics make the page feel heavier than the operation.

### Controls

Use one compact control row:

- Search input for product name, category, color, or size.
- Category filter.
- Stock filter with `Todos`, `Sin stock`, `Stock bajo`, and `Stock ok`.

Remove margin and active/inactive filters from the primary page.

### Desktop Table

Use a compact table with these columns:

- Producto
- Categoria
- Stock
- Estado
- Variantes
- Acciones

`Estado` should show only stock status:

- `Sin stock`
- `Stock bajo`
- `Ok`

Rows should be easy to scan. Product description, margin, price ranges, and side-panel inspection should not be part of the primary table.

### Mobile Layout

Use compact stacked rows instead of large metric cards. Each mobile item should show:

- Product name.
- Category.
- Stock total.
- Stock status.
- Variant count.
- Edit/delete actions.

Opening a product detail sheet is not required for this simplified version.

### Empty And Error States

Empty state should be direct and operational:

- No products: invite the user to add the first product.
- No search results: explain that filters/search have no matches.
- Load error: show a compact retry action.

Avoid verbose instructional copy.

## Add Product Page

`Nuevo producto` should use the same visual system as the list page.

### Layout

Use a compact page header with:

- Back button to `Productos`.
- Title: `Nuevo producto`.
- Short helper text.
- Save action at the bottom of the form or in a clear footer area.

The form should be split into two simple sections:

1. Product details.
2. Variants / stock.

### Product Details

Fields:

- Nombre, required.
- Categoria, required.
- Descripcion, optional.
- Activo, default on.

Labels and placeholders should be clean Spanish without encoding issues.

### Variants

The variant creation area should prioritize stock:

- Color, required.
- Talle, required.
- Stock.
- Stock minimo.
- Precio.

Cost, profit, and margin should not be primary fields. If the create API still requires cost, submit a default value of `0` internally.

The variants table should show:

- Color
- Talle
- Stock
- Minimo
- Precio
- Acciones

The user must add at least one variant before creating a product, matching current behavior.

## Edit Product Page

`Editar producto` should mirror the add page for consistency.

### Layout

Use the same compact header and two-section form:

1. Product details.
2. Variants / stock.

### Product Details

Editable fields:

- Nombre.
- Categoria.
- Descripcion.
- Activo.

### Variants

Variant management should focus on operational stock edits:

- Add variant with color, size, stock, minimum stock, and price.
- Edit stock, minimum stock, and price inline.
- Delete variant with confirmation.

Do not show cost, gain, or margin columns in the main variant table. Keep cost hidden in this stock-focused version.

### Save Behavior

Use toast feedback for success and failure. Avoid large success dialogs unless a destructive or unusual workflow requires confirmation. After a successful edit save, keep the user on the edit page and show a toast. After successful product creation, navigate back to `Productos` and show a toast.

## Components And Boundaries

Keep the implementation focused by using small UI units:

- A list page orchestrator for fetching, search, filtering, deletion, and summary text.
- A compact product table/list component.
- A compact product control bar.
- A shared product form component or shared form subcomponents for add/edit where practical.
- Product stock helper functions for status and summary calculations.

Do not introduce unrelated abstractions. Reuse existing API wrappers and shadcn/Radix UI primitives.

## Data Flow

The backend API remains unchanged.

The list page should:

1. Fetch products through the existing product API.
2. Filter locally by category and stock status.
3. Search using the existing `searchProducts` API behavior.
4. Derive stock summary text from visible products.
5. Delete products through the existing delete API and remove them from local state after success.

The add page should:

1. Collect product details.
2. Collect at least one variant.
3. Submit through the existing create product API.
4. Show toast feedback and navigate according to the current app pattern.

The edit page should:

1. Load the product by id.
2. Update product details through the existing update API.
3. Add, update, and delete variants through existing variant API functions.
4. Show toast feedback for each operation.

## Validation And Error Handling

Required validation:

- Product name is required.
- Category is required.
- Variant color is required.
- Variant size is required.
- At least one variant is required when creating a product.
- Stock and minimum stock cannot be negative.
- Price cannot be negative.

Errors should use compact toast messages and inline prevention where possible. Loading states should use skeletons sized like the final compact layout.

## Testing And Verification

Verification should include:

- `npm run build`.
- Manual check of `Productos`, `Nuevo producto`, and `Editar producto`.
- Desktop layout check for compact table density.
- Mobile layout check for readable compact rows and form fields.
- Empty state check.
- Search and stock filter check.
- Add variant, delete variant, create product, edit stock, and delete product flows where backend access allows it.

## Acceptance Criteria

- Products page no longer shows the large atelier header, four metric cards, margin filter, or detail side panel.
- Products page presents a compact stock-focused table on desktop.
- Mobile products view is compact and readable.
- Add and edit pages share the same minimal premium visual language.
- Add and edit variant workflows emphasize color, size, stock, minimum stock, and price.
- Cost, gain, and margin are not primary UI elements.
- The color and typography direction feels professional, restrained, and less beige/brown than the current interface.
- Existing backend contracts continue to work.
