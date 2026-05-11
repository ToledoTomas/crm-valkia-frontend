# Productos Stock Minimal Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the product section as a compact, minimal premium stock control workflow across the list, add, and edit screens.

**Architecture:** Keep the existing backend API wrappers and Next.js App Router routes. Replace the current audit-heavy product list with a stock-focused table and move add/edit toward shared form presentation and stock-first variant management. Use small helpers for stock status, summaries, and formatting so UI components stay mostly presentational.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Radix UI primitives, lucide-react, sonner.

---

## Spec Reference

Implement the approved spec:

- `docs/superpowers/specs/2026-05-11-productos-stock-minimal-premium-design.md`

## File Structure

Modify existing files:

- `src/app/layout.tsx`: load Geist font and apply it globally.
- `src/app/globals.css`: update theme tokens toward off-white, graphite, warm neutral borders, and restrained dark green accent.
- `src/app/(dashboard)/layout.tsx`: align dashboard shell background with the new visual direction.
- `src/app/(dashboard)/productos/_lib/product-audit.ts`: simplify product filters and stock helpers for the new stock-only page.
- `src/app/(dashboard)/productos/_components/ProductControlBar.tsx`: compact search/category/stock controls.
- `src/app/(dashboard)/productos/_components/ProductMasterTable.tsx`: compact desktop table and mobile rows.
- `src/app/(dashboard)/productos/page.tsx`: orchestrate fetching, search, stock filters, deletion, compact header, and table.
- `src/app/(dashboard)/productos/_components/Form/index.tsx`: rebuild add-product form as stock-first minimal premium UI.
- `src/app/(dashboard)/productos/editar-productos/page.tsx`: rebuild edit-product form as stock-first minimal premium UI.

Keep existing files unless they become unused after the list rewrite:

- `src/app/(dashboard)/productos/_components/ProductDetailPanel.tsx`: stop importing it from the product list. Leave the file in place in this plan to avoid unrelated deletion churn.
- `src/app/(dashboard)/productos/agregar-productos/page.tsx`: keep as a thin wrapper around `Form`.
- `src/app/(dashboard)/productos/api/index.ts`: no changes planned.
- `src/types/product.ts`: no changes planned.

## Implementation Tasks

### Task 1: Apply Minimal Premium Base Styling

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Load Geist in the root layout**

In `src/app/layout.tsx`, import `Geist` and apply the generated class to `<body>`.

Use this shape:

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Valkia CRM",
  description: "Sistema de gestion de ventas y productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={geist.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Replace global theme tokens**

In `src/app/globals.css`, keep imports and `@theme inline`, then update `html, body` font and the `:root` color variables to this minimal premium direction:

```css
html,
body,
#root,
.app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  font-family: var(--font-geist), system-ui, sans-serif;
}
```

Use these `:root` values:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.985 0.003 95);
  --foreground: oklch(0.22 0.01 95);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.22 0.01 95);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.22 0.01 95);
  --primary: oklch(0.36 0.045 165);
  --primary-foreground: oklch(0.985 0.003 95);
  --secondary: oklch(0.955 0.006 95);
  --secondary-foreground: oklch(0.28 0.012 95);
  --muted: oklch(0.96 0.004 95);
  --muted-foreground: oklch(0.52 0.01 95);
  --accent: oklch(0.94 0.018 155);
  --accent-foreground: oklch(0.28 0.035 165);
  --destructive: oklch(0.58 0.19 25);
  --destructive-foreground: oklch(0.985 0.003 95);
  --border: oklch(0.89 0.006 95);
  --input: oklch(0.89 0.006 95);
  --ring: oklch(0.42 0.055 165);
  --chart-1: oklch(0.42 0.055 165);
  --chart-2: oklch(0.58 0.06 210);
  --chart-3: oklch(0.64 0.07 65);
  --chart-4: oklch(0.56 0.09 25);
  --chart-5: oklch(0.48 0.04 120);
  --sidebar: oklch(0.975 0.003 95);
  --sidebar-foreground: oklch(0.22 0.01 95);
  --sidebar-primary: oklch(0.36 0.045 165);
  --sidebar-primary-foreground: oklch(0.985 0.003 95);
  --sidebar-accent: oklch(0.94 0.018 155);
  --sidebar-accent-foreground: oklch(0.28 0.035 165);
  --sidebar-border: oklch(0.89 0.006 95);
  --sidebar-ring: oklch(0.42 0.055 165);
}
```

Keep `.dark` values unless they cause build errors; this task does not require dark mode redesign.

- [ ] **Step 3: Update dashboard shell background**

In `src/app/(dashboard)/layout.tsx`, change the wrapper classes from `bg-gray-100` and mobile `bg-white border-b` to token-driven classes:

```tsx
<div className="flex h-full w-full overflow-hidden bg-background flex-col md:flex-row">
  <div className="hidden md:block h-full">
    <Sidebar />
  </div>
  <div className="md:hidden flex items-center bg-card border-b border-border p-4">
    <MobileSidebar />
    <div className="ml-4 text-xl font-semibold text-foreground">Valkia</div>
  </div>
  <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
</div>
```

- [ ] **Step 4: Verify base styling compiles**

Run:

```bash
npm run build
```

Expected:

- Build completes successfully, or fails only on an existing unrelated issue. If it fails, record the exact error before continuing.

- [ ] **Step 5: Commit base styling**

```bash
git add src/app/layout.tsx src/app/globals.css "src/app/(dashboard)/layout.tsx"
git commit -m "feat: apply minimal premium base styling"
```

### Task 2: Simplify Product Stock Helpers

**Files:**

- Modify: `src/app/(dashboard)/productos/_lib/product-audit.ts`

- [ ] **Step 1: Replace audit filter types with stock filter types**

Update the top of `product-audit.ts` so the exported types match the stock-only list:

```ts
import { EnrichedProduct } from "@/types/product";

export type ProductStockState = "sin-stock" | "bajo" | "ok";
export type ProductStockFilter = "all" | ProductStockState;

export interface ProductStockFilters {
  category: string;
  stock: ProductStockFilter;
}

export interface CatalogStockSummary {
  totalProducts: number;
  attentionCount: number;
}
```

- [ ] **Step 2: Keep stock state and remove margin helpers**

Keep `getProductStockState` and remove exported margin-specific helpers from this file. The stock state function should be:

```ts
export function getProductStockState(product: EnrichedProduct): ProductStockState {
  const variants = product.variants ?? [];
  if (variants.length === 0 || product.totalStock <= 0) return "sin-stock";
  if (variants.some((variant) => variant.stock <= variant.minStock)) return "bajo";
  return "ok";
}
```

- [ ] **Step 3: Add stock-focused categories, summary, filter, and sort helpers**

Add these functions:

```ts
export function getProductCategories(products: EnrichedProduct[]): string[] {
  return Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "es"));
}

export function getCatalogStockSummary(products: EnrichedProduct[]): CatalogStockSummary {
  return products.reduce<CatalogStockSummary>(
    (summary, product) => {
      const stockState = getProductStockState(product);
      summary.totalProducts += 1;
      summary.attentionCount += stockState === "sin-stock" || stockState === "bajo" ? 1 : 0;
      return summary;
    },
    { totalProducts: 0, attentionCount: 0 }
  );
}

export function filterProducts(
  products: EnrichedProduct[],
  filters: ProductStockFilters
): EnrichedProduct[] {
  return products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) return false;
    if (filters.stock !== "all" && getProductStockState(product) !== filters.stock) return false;
    return true;
  });
}

export function sortProductsForStock(products: EnrichedProduct[]): EnrichedProduct[] {
  const priority: Record<ProductStockState, number> = {
    "sin-stock": 0,
    bajo: 1,
    ok: 2,
  };

  return [...products].sort((a, b) => {
    const stateDiff = priority[getProductStockState(a)] - priority[getProductStockState(b)];
    if (stateDiff !== 0) return stateDiff;
    return a.name.localeCompare(b.name, "es");
  });
}
```

- [ ] **Step 4: Check for stale imports**

Run:

```bash
rg "ProductAuditFilters|getCatalogSummary|getProductMargin|sortProductsForAudit|ProductMargin" src/app/\(dashboard\)/productos
```

Expected before later tasks:

- Matches may still exist in product UI files. They must be removed by Tasks 3-5.

- [ ] **Step 5: Commit helper simplification**

```bash
git add "src/app/(dashboard)/productos/_lib/product-audit.ts"
git commit -m "refactor: simplify product stock helpers"
```

### Task 3: Rebuild Product Control Bar

**Files:**

- Modify: `src/app/(dashboard)/productos/_components/ProductControlBar.tsx`

- [ ] **Step 1: Update props and options**

Replace old `ProductAuditFilters` usage with `ProductStockFilters`:

```tsx
import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductStockFilters } from "../_lib/product-audit";

interface ProductControlBarProps {
  searchTerm: string;
  filters: ProductStockFilters;
  categories: string[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ProductStockFilters) => void;
}

const stockOptions: Array<{ value: ProductStockFilters["stock"]; label: string }> = [
  { value: "all", label: "Todo stock" },
  { value: "sin-stock", label: "Sin stock" },
  { value: "bajo", label: "Stock bajo" },
  { value: "ok", label: "Stock ok" },
];
```

- [ ] **Step 2: Render compact controls only**

The component should render one compact section with search, category, and stock filter. Use this structure:

```tsx
export function ProductControlBar({
  searchTerm,
  filters,
  categories,
  onSearchChange,
  onFiltersChange,
}: ProductControlBarProps) {
  const updateFilter = <Key extends keyof ProductStockFilters>(
    key: Key,
    value: ProductStockFilters[Key]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px] lg:items-center">
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Buscar productos"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar producto, categoria, color o talle"
            className="h-10 rounded-xl border-border bg-background pl-10 text-sm"
          />
        </div>

        <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger aria-label="Filtrar por categoria" className="h-10 rounded-xl border-border bg-background">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.stock}
          onValueChange={(value) => updateFilter("stock", value as ProductStockFilters["stock"])}
        >
          <SelectTrigger aria-label="Filtrar por stock" className="h-10 rounded-xl border-border bg-background">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            {stockOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify margin/state controls are gone**

Run:

```bash
rg "margin|stateOptions|Auditoria|Controles" "src/app/(dashboard)/productos/_components/ProductControlBar.tsx"
```

Expected:

- No matches.

- [ ] **Step 4: Commit control bar**

```bash
git add "src/app/(dashboard)/productos/_components/ProductControlBar.tsx"
git commit -m "feat: simplify product stock controls"
```

### Task 4: Rebuild Product Table And Mobile Rows

**Files:**

- Modify: `src/app/(dashboard)/productos/_components/ProductMasterTable.tsx`

- [ ] **Step 1: Remove margin and price imports**

Keep only icons needed for compact stock:

```tsx
import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import { Boxes, Layers3, PackageOpen, Pencil, SearchX, Trash2 } from "lucide-react";
```

Import only stock helper types/functions:

```tsx
import {
  getProductStockState,
  type ProductStockState,
} from "../_lib/product-audit";
```

- [ ] **Step 2: Define stock badge copy**

Use token classes instead of hardcoded beige/brown:

```tsx
const stockCopy: Record<ProductStockState, { label: string; className: string }> = {
  "sin-stock": {
    label: "Sin stock",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  bajo: {
    label: "Stock bajo",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  ok: {
    label: "Ok",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
};
```

- [ ] **Step 3: Replace desktop columns**

The desktop table header must contain exactly:

```tsx
<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Producto</TableHead>
<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoria</TableHead>
<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stock</TableHead>
<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</TableHead>
<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Variantes</TableHead>
<TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Acciones</TableHead>
```

- [ ] **Step 4: Replace desktop row content**

Each desktop row should show:

```tsx
const stockState = getProductStockState(product);
const variantsCount = product.variants?.length ?? 0;
```

Cells:

```tsx
<TableCell className="px-4 py-3">
  <button
    type="button"
    className="max-w-[320px] text-left outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-ring"
    aria-label={`Seleccionar ${product.name}`}
    aria-pressed={isSelected}
    onClick={(event) => {
      event.stopPropagation();
      onSelectProduct(product);
    }}
    onKeyDown={(event) => handleSelectableKeyDown(event, product, onSelectProduct)}
  >
    <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
  </button>
</TableCell>
<TableCell className="px-4 py-3 text-sm text-muted-foreground">
  {product.category || "Sin categoria"}
</TableCell>
<TableCell className="px-4 py-3 text-sm font-medium text-foreground">
  {product.totalStock}
</TableCell>
<TableCell className="px-4 py-3">
  <Badge variant="outline" className={stockCopy[stockState].className}>
    {stockCopy[stockState].label}
  </Badge>
</TableCell>
<TableCell className="px-4 py-3 text-sm text-muted-foreground">
  {variantsCount}
</TableCell>
<TableCell className="px-4 py-3">
  <ProductActions product={product} onDeleteProduct={onDeleteProduct} />
</TableCell>
```

- [ ] **Step 5: Replace mobile cards with compact rows**

Mobile rows should be `article` elements with no nested metric cards. They should show product name, category, stock count, badge, variant count, and actions. Use this class direction:

```tsx
className={cn(
  "rounded-2xl border bg-card p-4 shadow-sm transition-colors",
  isSelected ? "border-primary/40 bg-accent/50" : "border-border"
)}
```

- [ ] **Step 6: Update skeleton and empty states**

Skeleton rows should mirror the compact table and mobile rows. Empty state should use:

```tsx
{hasSearchOrFilters ? "Sin coincidencias" : "Sin productos cargados"}
```

and concise copy:

```tsx
{hasSearchOrFilters
  ? "No hay productos que coincidan con la busqueda o filtros activos."
  : "Carga el primer producto para empezar a controlar stock."}
```

- [ ] **Step 7: Verify removed concepts**

Run:

```bash
rg "Margen|Precio|CircleDollarSign|getProductMargin|getProductPrice|StateBadge|Activo|Inactivo" "src/app/(dashboard)/productos/_components/ProductMasterTable.tsx"
```

Expected:

- No matches.

- [ ] **Step 8: Commit table rewrite**

```bash
git add "src/app/(dashboard)/productos/_components/ProductMasterTable.tsx"
git commit -m "feat: add compact product stock table"
```

### Task 5: Rebuild Products Page Orchestration

**Files:**

- Modify: `src/app/(dashboard)/productos/page.tsx`

- [ ] **Step 1: Update imports and initial filters**

Remove imports for `ProductDetailPanel`, summary cards, margin helpers, and unused icons. Use:

```tsx
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EnrichedProduct } from "@/types/product";

import { ProductControlBar } from "./_components/ProductControlBar";
import { ProductMasterTable } from "./_components/ProductMasterTable";
import {
  filterProducts,
  getCatalogStockSummary,
  getProductCategories,
  sortProductsForStock,
  type ProductStockFilters,
} from "./_lib/product-audit";
import { deleteProduct, getProducts, searchProducts } from "./api";
```

Use:

```ts
const initialFilters: ProductStockFilters = {
  category: "all",
  stock: "all",
};
```

and:

```ts
function hasActiveFilters(filters: ProductStockFilters) {
  return filters.category !== "all" || filters.stock !== "all";
}
```

- [ ] **Step 2: Remove selected product/detail state**

Remove:

- `selectedProductId`
- `isMobileDetailOpen`
- `selectedProduct`
- `handleSelectProduct` opening detail panel
- `<ProductDetailPanel />`

Keep a row select callback that navigates to edit or does nothing. For this plan, keep selection visual simple by setting selected id on click without opening detail:

```tsx
const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

const handleSelectProduct = (product: EnrichedProduct) => {
  setSelectedProductId(product.id);
};
```

- [ ] **Step 3: Use stock helpers for visible products and summary**

Use:

```tsx
const visibleProducts = useMemo(
  () => sortProductsForStock(filterProducts(products, filters)),
  [filters, products]
);

const summary = useMemo(() => getCatalogStockSummary(visibleProducts), [visibleProducts]);
const hasSearchOrFilters = searchTerm.trim() !== "" || hasActiveFilters(filters);
```

- [ ] **Step 4: Replace header JSX**

Use a compact header:

```tsx
<header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Productos
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Control de stock simple para el catalogo actual.
      </p>
      <p className="mt-2 text-xs font-medium text-muted-foreground">
        {summary.totalProducts} productos cargados - {summary.attentionCount} requieren atencion
      </p>
    </div>
    <Button asChild className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
      <Link href="/productos/agregar-productos">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nuevo producto
      </Link>
    </Button>
  </div>
</header>
```

- [ ] **Step 5: Replace main layout**

Render only controls, optional error, and table:

```tsx
<main className="min-w-0">
  <ProductMasterTable
    products={visibleProducts}
    selectedProductId={selectedProductId}
    isLoading={isLoading}
    hasSearchOrFilters={hasSearchOrFilters}
    onSelectProduct={handleSelectProduct}
    onDeleteProduct={setProductToDelete}
  />
</main>
```

Keep the delete dialog but update any mojibake text to clean Spanish without accents if the file remains ASCII:

```tsx
<DialogTitle>Eliminar producto?</DialogTitle>
<DialogDescription>
  Estas por eliminar &quot;{productToDelete?.name}&quot;. Esta accion no se puede deshacer.
</DialogDescription>
```

- [ ] **Step 6: Verify page concepts are removed**

Run:

```bash
rg "ProductDetailPanel|SummaryCard|Atelier|Margen|Variantes\" value|Stock bajo\" value|isMobileDetailOpen" "src/app/(dashboard)/productos/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 7: Build checkpoint**

Run:

```bash
npm run build
```

Expected:

- Build succeeds. If it fails on stale imports from Tasks 2-5, fix those imports before committing.

- [ ] **Step 8: Commit list page**

```bash
git add "src/app/(dashboard)/productos/page.tsx" "src/app/(dashboard)/productos/_lib/product-audit.ts" "src/app/(dashboard)/productos/_components/ProductControlBar.tsx" "src/app/(dashboard)/productos/_components/ProductMasterTable.tsx"
git commit -m "feat: simplify products stock page"
```

### Task 6: Rebuild Add Product Form

**Files:**

- Modify: `src/app/(dashboard)/productos/_components/Form/index.tsx`
- Verify: `src/app/(dashboard)/productos/agregar-productos/page.tsx`

- [ ] **Step 1: Remove success dialog dependency**

Remove imports and state for `Dialog`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogTitle`, `CheckCircle`, and `showSuccess`.

Keep:

```tsx
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
```

- [ ] **Step 2: Keep variant state but treat cost as hidden default**

Keep `VariantFormData` based on `CreateProductVariantDto`, but initialize and reset `cost` to `0`:

```ts
const emptyVariant: VariantFormData = {
  color: "",
  size: "",
  cost: 0,
  price: 0,
  stock: 0,
  minStock: 0,
};
```

Use `useState<VariantFormData>(emptyVariant)` and reset with `{ ...emptyVariant }`.

- [ ] **Step 3: Add number normalizers**

Add helpers near state:

```ts
const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toInteger = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};
```

- [ ] **Step 4: Update validation**

In `addVariant`, validate:

```ts
if (!newVariant.color.trim() || !newVariant.size.trim()) {
  toast.error("Color y talle son obligatorios");
  return;
}

if (newVariant.stock < 0 || (newVariant.minStock ?? 0) < 0) {
  toast.error("El stock no puede ser negativo");
  return;
}

if (newVariant.price < 0) {
  toast.error("El precio no puede ser negativo");
  return;
}
```

Keep duplicate color/size validation.

- [ ] **Step 5: Submit and navigate with toast**

In `handleSubmit`, after `createProduct`, use:

```ts
toast.success("Producto creado");
router.push("/productos");
```

Do not render a success dialog.

- [ ] **Step 6: Replace layout with compact sections**

Use top-level wrapper:

```tsx
<div className="mx-auto max-w-5xl space-y-5">
```

Header:

```tsx
<div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
  <div className="flex items-center gap-3">
    <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
      <Link href="/productos" aria-label="Volver a productos">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nuevo producto</h1>
      <p className="text-sm text-muted-foreground">Carga datos basicos y stock inicial.</p>
    </div>
  </div>
</div>
```

- [ ] **Step 7: Render product details card**

Use `Card` with token classes:

```tsx
<Card className="rounded-2xl border-border shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle className="text-base">Datos del producto</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    ...
  </CardContent>
</Card>
```

Fields must be:

- Nombre
- Categoria
- Descripcion
- Producto activo

Use clean example text in input placeholders:

```tsx
placeholder="Ej: Remera basica"
placeholder="Ej: Remeras"
placeholder="Descripcion breve del producto"
```

- [ ] **Step 8: Render stock-first variant input**

Variant input grid must contain only:

- Color
- Talle
- Stock
- Stock minimo
- Precio
- Button: `Agregar variante`

Do not render cost, gain, or margin inputs.

- [ ] **Step 9: Render compact variant table**

Table columns must be:

- Color
- Talle
- Stock
- Minimo
- Precio
- Acciones

Remove gain and margin columns. Use `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })` for price.

- [ ] **Step 10: Verify add form concepts are removed**

Run:

```bash
rg "Ganancia|Margen|Costo|showSuccess|CheckCircle|Dialog" "src/app/(dashboard)/productos/_components/Form/index.tsx"
```

Expected:

- No matches, except `cost: 0` is acceptable if searching `cost` separately.

- [ ] **Step 11: Build checkpoint**

Run:

```bash
npm run build
```

Expected:

- Build succeeds.

- [ ] **Step 12: Commit add form**

```bash
git add "src/app/(dashboard)/productos/_components/Form/index.tsx" "src/app/(dashboard)/productos/agregar-productos/page.tsx"
git commit -m "feat: simplify add product stock form"
```

### Task 7: Rebuild Edit Product Form

**Files:**

- Modify: `src/app/(dashboard)/productos/editar-productos/page.tsx`

- [ ] **Step 1: Align imports with compact edit page**

Use these imports:

```tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
```

Remove `useRouter`, `CheckCircle`, success dialog imports, `Badge` if not needed, and margin/profit helpers.

- [ ] **Step 2: Add empty variant and number normalizers**

Use:

```ts
const emptyVariant = {
  color: "",
  size: "",
  cost: 0,
  price: 0,
  stock: 0,
  minStock: 0,
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toInteger = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};
```

Initialize `newVariant` with `{ ...emptyVariant }`.

- [ ] **Step 3: Update add variant validation**

Use the same validation as add form:

```ts
if (!newVariant.color.trim() || !newVariant.size.trim()) {
  toast.error("Color y talle son obligatorios");
  return;
}

if (newVariant.stock < 0 || newVariant.minStock < 0) {
  toast.error("El stock no puede ser negativo");
  return;
}

if (newVariant.price < 0) {
  toast.error("El precio no puede ser negativo");
  return;
}
```

When calling `addVariant`, send `cost: 0`.

- [ ] **Step 4: Limit inline variant edits**

The existing variants table should allow inline edits only for:

- `stock`
- `minStock`
- `price`

Do not render inline inputs for `cost`, `ganancia`, or `margen`.

- [ ] **Step 5: Replace confirm with dialog or keep confirm clean**

Use existing `window.confirm` if keeping scope small, but fix copy:

```ts
if (!window.confirm("Eliminar esta variante?")) return;
```

- [ ] **Step 6: Save product with toast only**

In `handleSubmit`, replace success dialog behavior with:

```ts
await updateProduct(parseInt(id), formData);
toast.success("Producto actualizado");
```

Remove `showSuccess` state and success dialog JSX.

- [ ] **Step 7: Replace loading and not-found states**

Loading:

```tsx
<div className="mx-auto max-w-5xl space-y-4">
  <Skeleton className="h-20 rounded-2xl" />
  <Skeleton className="h-56 rounded-2xl" />
  <Skeleton className="h-72 rounded-2xl" />
</div>
```

Not found:

```tsx
<div className="mx-auto flex h-96 max-w-5xl flex-col items-center justify-center gap-4 text-center">
  <p className="text-sm text-muted-foreground">Producto no encontrado</p>
  <Button asChild variant="outline" className="rounded-xl">
    <Link href="/productos">
      <ArrowLeft className="h-4 w-4" />
      Volver
    </Link>
  </Button>
</div>
```

- [ ] **Step 8: Replace edit layout**

Mirror the add form layout:

```tsx
<div className="mx-auto max-w-5xl space-y-5">
  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
        <Link href="/productos" aria-label="Volver a productos">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Editar producto</h1>
        <p className="text-sm text-muted-foreground">{product.name}</p>
      </div>
    </div>
  </div>
  ...
</div>
```

- [ ] **Step 9: Render compact stock table**

Existing variants table columns must be:

- Color
- Talle
- Stock
- Minimo
- Precio
- Acciones

Use input widths:

```tsx
className="h-9 w-24 rounded-lg"
```

for stock/min/price cells.

- [ ] **Step 10: Verify edit form concepts are removed**

Run:

```bash
rg "Ganancia|Margen|Costo|showSuccess|CheckCircle|Dialog|calculateProfit|calculateMargin|router.push" "src/app/(dashboard)/productos/editar-productos/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 11: Build checkpoint**

Run:

```bash
npm run build
```

Expected:

- Build succeeds.

- [ ] **Step 12: Commit edit form**

```bash
git add "src/app/(dashboard)/productos/editar-productos/page.tsx"
git commit -m "feat: simplify edit product stock form"
```

### Task 8: Final Verification And Cleanup

**Files:**

- Review all modified files from Tasks 1-7.

- [ ] **Step 1: Search for removed product concepts**

Run:

```bash
rg "Atelier|Auditoria|Margen|Ganancia|Costo|ProductDetailPanel|getProductMargin|getProductPrice|ProductAuditFilters|sortProductsForAudit|getCatalogSummary" "src/app/(dashboard)/productos"
```

Expected:

- No matches in active list/add/edit UI.
- `ProductDetailPanel.tsx` may still contain old words because it is no longer imported. If it appears only in that unused file, leave it for a separate cleanup unless the user asks to delete it.

- [ ] **Step 2: Verify imports**

Run:

```bash
npm run build
```

Expected:

- Build succeeds.

- [ ] **Step 3: Run lint if build succeeds**

Run:

```bash
npm run lint
```

Expected:

- Lint succeeds, or reports only pre-existing unrelated issues. Record exact failures in the final handoff.

- [ ] **Step 4: Manual browser check**

Start the dev server:

```bash
npm run dev -- --port 3002
```

Open:

- `http://localhost:3002/productos`
- `http://localhost:3002/productos/agregar-productos`
- `http://localhost:3002/productos/editar-productos?id=<existing-product-id>`

Check:

- Products page has compact header, controls, and stock table.
- Desktop table has only Product, Categoria, Stock, Estado, Variantes, Acciones.
- Mobile width uses compact rows, not large metric cards.
- Add form hides cost/gain/margin and can add/delete variants.
- Edit form hides cost/gain/margin and can edit stock/minimum/price.
- Toasts appear for successful create/update/delete paths when backend is available.

- [ ] **Step 5: Final git status**

Run:

```bash
git status --short
```

Expected:

- No uncommitted changes, or only intentionally uncommitted notes requested by the user.

- [ ] **Step 6: Commit final cleanup if needed**

If Task 8 required small fixes:

```bash
git add src/app src/types
git commit -m "chore: finalize product stock redesign"
```

If no fixes were needed, do not create an empty commit.

## Self-Review

- Spec coverage: Products list, add product, edit product, stock-first variants, Geist typography, off-white/graphite/green visual direction, removed margin-heavy UI, validation, and build verification are covered.
- Placeholder scan: This plan contains no `TBD`, `TODO`, or deferred implementation markers.
- Type consistency: The plan consistently uses `ProductStockFilters`, `ProductStockState`, `getCatalogStockSummary`, `filterProducts`, and `sortProductsForStock`.
