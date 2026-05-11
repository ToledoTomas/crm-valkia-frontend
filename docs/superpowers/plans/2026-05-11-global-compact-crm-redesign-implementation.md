# Global Compact CRM Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the compact minimal premium product-section direction to the rest of the CRM while hiding Stock and Reportes from normal navigation.

**Architecture:** Keep existing Next.js routes and API wrappers. Simplify each page locally instead of introducing broad shared abstractions, because the app already has route-level page components and the scope is presentation plus light flow cleanup. Redirect hidden routes through their existing page files so direct URLs remain valid.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/Radix UI primitives, lucide-react, sonner.

---

## Spec Reference

Implement the approved spec:

- `docs/superpowers/specs/2026-05-11-global-compact-crm-redesign-design.md`

## File Structure

Modify existing files:

- `src/app/(components)/Sidebar/index.tsx`: remove `Stock` and `Reportes` from visible navigation and align sidebar styling with the minimal premium system.
- `src/app/(components)/MobileSidebar/index.tsx`: keep behavior and apply the compact trigger class.
- `src/app/(dashboard)/stock/page.tsx`: replace stock UI with a redirect to `/productos`.
- `src/app/(dashboard)/reportes/page.tsx`: replace reports placeholder UI with a redirect to `/dashboard`.
- `src/app/(dashboard)/dashboard/page.tsx`: reduce dashboard to four compact indicators.
- `src/app/(dashboard)/ventas/page.tsx`: compact sales list and detail dialog.
- `src/app/(dashboard)/ventas/nueva/page.tsx`: simplify new-sale workflow and remove cost/profit UI.
- `src/app/(dashboard)/clientes/page.tsx`: compact customers list.
- `src/app/(dashboard)/clientes/_components/Form/index.tsx`: simplify add-customer form with toast navigation.
- `src/app/(dashboard)/clientes/agregar-clientes/page.tsx`: compact add-customer page shell.
- `src/app/(dashboard)/clientes/editar-clientes/page.tsx`: compact edit-customer form with toast navigation.
- `src/app/(dashboard)/configuracion/page.tsx`: reduce to account/session essentials.

No backend API files should change.

## Implementation Tasks

### Task 1: Navigation And Hidden Route Redirects

**Files:**

- Modify: `src/app/(components)/Sidebar/index.tsx`
- Modify: `src/app/(components)/MobileSidebar/index.tsx`
- Modify: `src/app/(dashboard)/stock/page.tsx`
- Modify: `src/app/(dashboard)/reportes/page.tsx`

- [ ] **Step 1: Remove hidden menu items from sidebar imports**

In `src/app/(components)/Sidebar/index.tsx`, remove unused imports:

```tsx
Warehouse,
BarChart3,
```

Keep:

```tsx
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
```

- [ ] **Step 2: Replace menu items**

Set `menuItems` to exactly:

```tsx
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Ventas", path: "/ventas", icon: ShoppingCart },
  { name: "Productos", path: "/productos", icon: Package },
  { name: "Clientes", path: "/clientes", icon: Users },
];
```

Keep `Configuracion` in the bottom section.

- [ ] **Step 3: Align sidebar styling with tokens**

Change the outer sidebar class to:

```tsx
"h-full w-64 border-r border-border bg-card text-foreground flex flex-col p-4 shadow-sm"
```

Change the active link class branch to:

```tsx
? "bg-primary text-primary-foreground font-medium"
: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
```

Change the settings link branch the same way.

Change logout link class to:

```tsx
"flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
```

Use `rounded-xl` for all sidebar nav links.

- [ ] **Step 4: Keep MobileSidebar behavior**

In `src/app/(components)/MobileSidebar/index.tsx`, keep `Sidebar` as the source of menu items and set the trigger class:

```tsx
<Button variant="ghost" size="icon" className="md:hidden rounded-xl">
  <Menu />
</Button>
```

- [ ] **Step 5: Redirect stock route**

Replace `src/app/(dashboard)/stock/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function StockPage() {
  redirect("/productos");
}
```

- [ ] **Step 6: Redirect reportes route**

Replace `src/app/(dashboard)/reportes/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function ReportesPage() {
  redirect("/dashboard");
}
```

- [ ] **Step 7: Verify hidden nav strings**

Run:

```bash
rg "Stock|Reportes|Warehouse|BarChart3" "src/app/(components)/Sidebar/index.tsx" "src/app/(components)/MobileSidebar/index.tsx"
```

Expected:

- No matches.

- [ ] **Step 8: Verify redirects compile**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

- [ ] **Step 9: Commit navigation and redirects**

```bash
git add "src/app/(components)/Sidebar/index.tsx" "src/app/(components)/MobileSidebar/index.tsx" "src/app/(dashboard)/stock/page.tsx" "src/app/(dashboard)/reportes/page.tsx"
git commit -m "feat: simplify navigation and redirect hidden sections"
```

### Task 2: Simplify Dashboard

**Files:**

- Modify: `src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Simplify imports**

Remove chart imports and unused icons. Use:

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getKPIs } from "./api";
import { DashboardKPIs } from "@/types/dashboard";
```

- [ ] **Step 2: Fetch only KPI data**

Remove state for `salesData`, `profitData`, and `topProducts`. Replace `fetchData` with:

```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const kpisRes = await getKPIs();
      setKpis(kpisRes);
    } catch {
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

- [ ] **Step 3: Keep currency formatter**

Use:

```tsx
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
};
```

Remove `formatMonth`.

- [ ] **Step 4: Replace loading state**

Use compact skeletons:

```tsx
if (isLoading) {
  return (
    <div className="space-y-5">
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Replace page body**

Use this page structure:

```tsx
return (
  <div className="space-y-5">
    <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estado simple del negocio para operar el dia.
      </p>
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Ventas hoy"
        value={formatCurrency(kpis?.salesToday ?? 0)}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="Ventas del mes"
        value={formatCurrency(kpis?.salesThisMonth ?? 0)}
        subtitle={`${kpis?.salesCountThisMonth ?? 0} ventas`}
        icon={<ShoppingCart className="h-4 w-4" />}
      />
      <Link href="/productos">
        <KPICard
          title="Productos con atencion"
          value={String(kpis?.lowStockCount ?? 0)}
          icon={<Package className="h-4 w-4" />}
          alert={(kpis?.lowStockCount ?? 0) > 0}
        />
      </Link>
      <Link href="/clientes">
        <KPICard
          title="Clientes nuevos"
          value={`+${kpis?.newCustomersThisMonth ?? 0}`}
          subtitle="Este mes"
          icon={<Users className="h-4 w-4" />}
        />
      </Link>
    </div>
  </div>
);
```

- [ ] **Step 6: Replace KPI card component**

Use:

```tsx
interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>;
  subtitle?: string;
  alert?: boolean;
}

function KPICard({ title, value, icon, subtitle, alert }: KPICardProps) {
  return (
    <Card className="h-full rounded-2xl border-border shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={alert ? "mt-2 text-2xl font-semibold text-red-600" : "mt-2 text-2xl font-semibold text-foreground"}>
              {value}
            </p>
            {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
          <span className={alert ? "rounded-xl bg-red-50 p-2 text-red-600" : "rounded-xl bg-accent p-2 text-primary"}>
            {React.cloneElement(icon, { className: "h-4 w-4" })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 7: Verify removed dashboard concepts**

Run:

```bash
rg "BarChart|AreaChart|ResponsiveContainer|getSalesByMonth|getProfitByMonth|getTopProducts|Top 5|Ganancia vs Costo|Ventas por Mes|formatMonth|ArrowDownRight|TrendingUp" "src/app/(dashboard)/dashboard/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 8: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/dashboard/page.tsx"
git commit -m "feat: simplify dashboard overview"
```

### Task 3: Simplify Sales List

**Files:**

- Modify: `src/app/(dashboard)/ventas/page.tsx`

- [ ] **Step 1: Keep focused imports**

Use icons:

```tsx
import { Calendar, Eye, Plus, Trash2, User } from "lucide-react";
```

Keep `Badge` for variant display in the detail dialog.

- [ ] **Step 2: Update header**

Replace the page header with:

```tsx
<header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Ventas
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Historial simple de ventas registradas.
      </p>
    </div>
    <Button asChild className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
      <Link href="/ventas/nueva">
        <Plus className="h-4 w-4" />
        Nueva venta
      </Link>
    </Button>
  </div>
</header>
```

- [ ] **Step 3: Replace table shell**

Use:

```tsx
<div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
```

Skeletons should be inside `p-4 space-y-3`, with `h-10`.

- [ ] **Step 4: Remove profit column from table**

Table headers must be exactly:

```tsx
<TableHead>Venta</TableHead>
<TableHead>Cliente</TableHead>
<TableHead>Fecha</TableHead>
<TableHead>Items</TableHead>
<TableHead>Total</TableHead>
<TableHead className="text-right">Acciones</TableHead>
```

Set empty-state colspan to `6`.

Rows should not render `invoice.totalProfit` or `invoice.totalCost`.

- [ ] **Step 5: Simplify detail dialog metrics**

In selected invoice detail dialog, replace the three metric grid with one compact total block:

```tsx
<div className="rounded-2xl border border-border bg-background p-4">
  <p className="text-sm text-muted-foreground">Total</p>
  <p className="mt-1 text-2xl font-semibold text-foreground">
    {selectedInvoice && formatCurrency(selectedInvoice.total)}
  </p>
</div>
```

Keep the items table with columns:

- Producto
- Variante
- Cantidad
- Precio
- Subtotal

- [ ] **Step 6: Clean dialog copy**

Use ASCII copy:

```tsx
<DialogTitle>Anular venta?</DialogTitle>
<DialogDescription>
  Estas por anular la venta #{invoiceToDelete?.id}. Esto revertira el stock de los productos vendidos.
</DialogDescription>
```

- [ ] **Step 7: Verify removed sales list concepts**

Run:

```bash
rg "Ganancia|Costo|totalProfit|totalCost|Historial de ventas y transacciones|Nueva Venta" "src/app/(dashboard)/ventas/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 8: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/ventas/page.tsx"
git commit -m "feat: simplify sales list"
```

### Task 4: Simplify New Sale Flow

**Files:**

- Modify: `src/app/(dashboard)/ventas/nueva/page.tsx`

- [ ] **Step 1: Remove success dialog dependency**

Remove `CheckCircle`, `showSuccess`, and success dialog JSX.

Keep these imports:

```tsx
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
```

- [ ] **Step 2: Keep cart item cost only internally**

Keep `cost` in `CartItem` for compatibility if already set from variants, but do not render it and do not calculate/display profit.

Remove:

```tsx
const calculateCost = ...
const calculateProfit = ...
```

- [ ] **Step 3: Change successful submit behavior**

After `createInvoice`, use:

```tsx
toast.success("Venta registrada");
router.push("/ventas");
```

Remove `setShowSuccess(true)`.

- [ ] **Step 4: Replace page header**

Use:

```tsx
<header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
  <div className="flex items-center gap-3">
    <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
      <Link href="/ventas" aria-label="Volver a ventas">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Nueva venta
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Selecciona productos, cantidades y confirma el total.
      </p>
    </div>
  </div>
</header>
```

- [ ] **Step 5: Apply compact card styling**

Every `Card` in the page should use:

```tsx
className="rounded-2xl border-border shadow-sm"
```

Use `CardTitle className="flex items-center gap-2 text-base"` for card titles.

- [ ] **Step 6: Remove profit UI from selected variant**

Replace selected variant info with:

```tsx
{selectedVariant && (
  <div className="text-sm text-muted-foreground">
    Precio: {formatCurrency(selectedVariant.price)}
  </div>
)}
```

No `Ganancia` text should remain.

- [ ] **Step 7: Simplify cart summary**

Render only total:

```tsx
<div className="mt-6 rounded-2xl border border-border bg-background p-4">
  <div className="flex items-center justify-between text-lg font-semibold">
    <span>Total</span>
    <span>{formatCurrency(calculateTotal())}</span>
  </div>
</div>
```

- [ ] **Step 8: Verify removed new-sale concepts**

Run:

```bash
rg "Ganancia|Costo|calculateCost|calculateProfit|showSuccess|CheckCircle|Venta Completada|green-600" "src/app/(dashboard)/ventas/nueva/page.tsx"
```

Expected:

- No matches, except `cost` may still appear only as an internal `CartItem` property and assignment.

- [ ] **Step 9: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/ventas/nueva/page.tsx"
git commit -m "feat: simplify new sale flow"
```

### Task 5: Simplify Customers List

**Files:**

- Modify: `src/app/(dashboard)/clientes/page.tsx`

- [ ] **Step 1: Simplify imports**

Use:

```tsx
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Edit2, Phone, Plus, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";
```

Remove `Instagram`, `Crown`, `Badge`, `CustomerClassification`, and `formatCurrency`.

- [ ] **Step 2: Remove classification badge helper**

Delete `getClassificationBadge`.

- [ ] **Step 3: Replace header and search**

Use compact header:

```tsx
<header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Clientes
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Contactos simples para ventas y seguimiento.
      </p>
    </div>
    <Button asChild className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
      <Link href="/clientes/agregar-clientes">
        <Plus className="h-4 w-4" />
        Nuevo cliente
      </Link>
    </Button>
  </div>
</header>
```

Search shell:

```tsx
<div className="relative">
  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    placeholder="Buscar clientes"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="h-10 rounded-xl border-border bg-card pl-10"
  />
</div>
```

- [ ] **Step 4: Replace table columns**

Headers:

```tsx
<TableHead>Cliente</TableHead>
<TableHead>Contacto</TableHead>
<TableHead>Compras</TableHead>
<TableHead className="text-right">Acciones</TableHead>
```

Set empty colspan to `4`.

Rows:

```tsx
<TableCell className="font-medium">{customer.name}</TableCell>
<TableCell>
  <div className="space-y-1 text-sm text-muted-foreground">
    {customer.phone ? (
      <div className="flex items-center gap-1">
        <Phone className="h-3 w-3" />
        {customer.phone}
      </div>
    ) : null}
    {customer.email ? <div>{customer.email}</div> : null}
  </div>
</TableCell>
<TableCell>{customer.orderCount}</TableCell>
```

- [ ] **Step 5: Clean delete copy**

Use:

```tsx
<DialogTitle>Eliminar cliente?</DialogTitle>
<DialogDescription>
  Estas por eliminar a &quot;{customerToDelete?.name}&quot;. Esta accion no se puede deshacer.
</DialogDescription>
```

- [ ] **Step 6: Verify removed customer list concepts**

Run:

```bash
rg "Clasificaci|Total Gastado|Ultima|Instagram|Crown|formatCurrency|totalSpent|classification|lastPurchase" "src/app/(dashboard)/clientes/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 7: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/clientes/page.tsx"
git commit -m "feat: simplify customers list"
```

### Task 6: Simplify Add Customer Form

**Files:**

- Modify: `src/app/(dashboard)/clientes/_components/Form/index.tsx`
- Modify: `src/app/(dashboard)/clientes/agregar-clientes/page.tsx`

- [ ] **Step 1: Remove success dialog**

In `Form/index.tsx`, remove imports and state for:

- `Dialog`
- `DialogContent`
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`
- `CheckCircle`
- `showSuccess`
- `handleSuccessClose`

- [ ] **Step 2: Rename form field from fullname to name**

Use state:

```tsx
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
});
```

Submit:

```tsx
await createCustomer({
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
});
toast.success("Cliente creado");
router.push("/clientes");
router.refresh();
```

Resetting form state is not required because the page navigates away.

- [ ] **Step 3: Render compact form card**

Use:

```tsx
<Card className="rounded-2xl border-border shadow-sm">
  <form onSubmit={handleSubmit}>
    <CardHeader className="pb-3">
      <CardTitle className="text-base">Datos del cliente</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      ...
    </CardContent>
    <CardFooter className="flex justify-end gap-2">
      ...
    </CardFooter>
  </form>
</Card>
```

Fields:

- `name` with label `Nombre`.
- `email` with label `Email`.
- `phone` with label `Telefono`.

Button:

```tsx
<Button type="submit" disabled={loading} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
```

- [ ] **Step 4: Update add-customer page shell**

In `agregar-clientes/page.tsx`, use:

```tsx
<div className="mx-auto max-w-2xl space-y-5">
  <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
        <Link href="/clientes" aria-label="Volver a clientes">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nuevo cliente</h1>
        <p className="mt-1 text-sm text-muted-foreground">Carga los datos basicos de contacto.</p>
      </div>
    </div>
  </header>
  <Form />
</div>
```

Import `Button`.

- [ ] **Step 5: Verify removed add-customer concepts**

Run:

```bash
rg "Dialog|CheckCircle|showSuccess|Operacion|Exitosa|fullname|bg-\\[#e5e5d0\\]" "src/app/(dashboard)/clientes/_components/Form/index.tsx" "src/app/(dashboard)/clientes/agregar-clientes/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 6: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/clientes/_components/Form/index.tsx" "src/app/(dashboard)/clientes/agregar-clientes/page.tsx"
git commit -m "feat: simplify add customer form"
```

### Task 7: Simplify Edit Customer Form

**Files:**

- Modify: `src/app/(dashboard)/clientes/editar-clientes/page.tsx`

- [ ] **Step 1: Add toast import**

Add:

```tsx
import { toast } from "sonner";
```

- [ ] **Step 2: Save with toast and navigation**

After `updateCustomer(Number(id), formData);`, use:

```tsx
toast.success("Cliente actualizado");
router.push("/clientes");
router.refresh();
```

- [ ] **Step 3: Replace outer layout**

Use:

```tsx
<div className="mx-auto max-w-2xl space-y-5">
  <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
    <div className="flex items-center gap-3">
      <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
        <Link href="/clientes" aria-label="Volver a clientes">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Editar cliente</h1>
        <p className="mt-1 text-sm text-muted-foreground">Actualiza los datos basicos de contacto.</p>
      </div>
    </div>
  </header>
  ...
</div>
```

- [ ] **Step 4: Replace card classes and labels**

Card:

```tsx
<Card className="rounded-2xl border-border shadow-sm">
```

Card title:

```tsx
<CardTitle className="text-base">Datos del cliente</CardTitle>
```

Fields:

- `name`, label `Nombre`.
- `email`, label `Email`.
- `phone`, label `Telefono`.

Button:

```tsx
className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
```

- [ ] **Step 5: Clean comments/copy**

Remove inline comments:

```tsx
// Redirect back to list
// Refresh data
```

Use ASCII copy for errors:

```tsx
No se proporciono un ID de cliente valido.
Error al cargar los datos del cliente.
```

- [ ] **Step 6: Verify edit customer form concepts**

Run:

```bash
rg "fullname|Informaci|bg-\\[#e5e5d0\\]|Redirect back|Refresh data|Configuraci" "src/app/(dashboard)/clientes/editar-clientes/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 7: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/clientes/editar-clientes/page.tsx"
git commit -m "feat: simplify edit customer form"
```

### Task 8: Simplify Configuracion

**Files:**

- Modify: `src/app/(dashboard)/configuracion/page.tsx`

- [ ] **Step 1: Simplify imports**

Use:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { Building2, LogOut, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
```

- [ ] **Step 2: Replace page body**

Use:

```tsx
return (
  <div className="mx-auto max-w-3xl space-y-5">
    <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Configuracion
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Cuenta, sesion y datos basicos del sistema.
      </p>
    </header>

    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4" />
          Cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-foreground">Administrador</p>
            <p className="text-sm text-muted-foreground">Rol: Admin</p>
          </div>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>admin@valkia.com</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Valkia CRM</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Sesion</p>
            <p className="text-sm text-muted-foreground">Salir del sistema en este dispositivo.</p>
          </div>
          <Button variant="destructive" className="rounded-xl" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Cerrar sesion
          </Button>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </CardContent>
    </Card>
  </div>
);
```

- [ ] **Step 3: Verify removed config concepts**

Run:

```bash
rg "Acerca|gestion|disenado|Febrero|md:col-span-2|Informaci" "src/app/(dashboard)/configuracion/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 4: Build and commit**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

Commit:

```bash
git add "src/app/(dashboard)/configuracion/page.tsx"
git commit -m "feat: simplify configuration page"
```

### Task 9: Final Verification

**Files:**

- Review all modified files from Tasks 1-8.

- [ ] **Step 1: Verify hidden sections are not in nav**

Run:

```bash
rg "Stock|Reportes|Warehouse|BarChart3" "src/app/(components)"
```

Expected:

- No matches.

- [ ] **Step 2: Verify removed advanced concepts in active pages**

Run:

```bash
rg "Ganancia|Costo|Rentabilidad|Top 5|Clasificaci|Total Gastado|Ultima Compra|Acerca de|Exportar a Excel" "src/app/(dashboard)/dashboard/page.tsx" "src/app/(dashboard)/ventas/page.tsx" "src/app/(dashboard)/ventas/nueva/page.tsx" "src/app/(dashboard)/clientes/page.tsx" "src/app/(dashboard)/configuracion/page.tsx"
```

Expected:

- No matches.

- [ ] **Step 3: Run build**

Run:

```bash
npm.cmd run build
```

Expected:

- Build succeeds.

- [ ] **Step 4: Run lint**

Run:

```bash
npm.cmd run lint
```

Expected:

- Lint exits with code `0`.
- Existing warnings are acceptable if there are no errors.

- [ ] **Step 5: Start dev server**

Run:

```bash
npm.cmd run dev -- --port 3002
```

Expected:

- App is available at `http://localhost:3002`.

- [ ] **Step 6: Manual browser checks**

Check these URLs:

- `http://localhost:3002/dashboard`
- `http://localhost:3002/ventas`
- `http://localhost:3002/ventas/nueva`
- `http://localhost:3002/productos`
- `http://localhost:3002/clientes`
- `http://localhost:3002/clientes/agregar-clientes`
- `http://localhost:3002/configuracion`
- `http://localhost:3002/stock`
- `http://localhost:3002/reportes`

Expected:

- Sidebar/mobile sidebar shows only Dashboard, Ventas, Productos, Clientes, Configuracion.
- `/stock` lands on Productos.
- `/reportes` lands on Dashboard.
- Pages use compact headers, token colors, and simplified tables/forms.

- [ ] **Step 7: Final status**

Run:

```bash
git status --short
```

Expected:

- No uncommitted changes.

If Task 9 requires cleanup fixes, commit them:

```bash
git add src/app
git commit -m "chore: finalize compact crm redesign"
```

## Self-Review

- Spec coverage: Navigation, hidden Stock/Reportes redirects, Dashboard, Ventas, Nueva venta, Clientes, Nuevo cliente, Editar cliente, Configuracion, build, lint, and manual checks are all covered.
- Marker scan: No `TBD`, `TODO`, vague future tasks, or undefined functions are included.
- Type consistency: The plan uses existing API names and types: `getKPIs`, `getInvoices`, `deleteInvoice`, `createInvoice`, `getCustomers`, `searchCustomers`, `createCustomer`, `getCustomerById`, `updateCustomer`, and `deleteCustomer`.
