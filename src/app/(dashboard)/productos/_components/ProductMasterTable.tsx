"use client";

import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import { Boxes, Layers3, PackageOpen, Pencil, SearchX, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { EnrichedProduct } from "@/types/product";

import { getProductStockState, type ProductStockState } from "../_lib/product-audit";

interface ProductMasterTableProps {
  products: EnrichedProduct[];
  selectedProductId: number | null;
  isLoading: boolean;
  hasSearchOrFilters: boolean;
  onSelectProduct: (product: EnrichedProduct) => void;
  onDeleteProduct: (product: EnrichedProduct) => void;
}

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

function stopRowSelection(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

function handleSelectableKeyDown(
  event: KeyboardEvent,
  product: EnrichedProduct,
  onSelectProduct: (product: EnrichedProduct) => void
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onSelectProduct(product);
}

function EmptyState({ hasSearchOrFilters }: { hasSearchOrFilters: boolean }) {
  const Icon = hasSearchOrFilters ? SearchX : PackageOpen;

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-semibold text-foreground">
        {hasSearchOrFilters ? "Sin coincidencias" : "Sin productos cargados"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasSearchOrFilters
          ? "No hay productos que coincidan con la busqueda o filtros activos."
          : "Carga el primer producto para empezar a controlar stock."}
      </p>
    </div>
  );
}

function DesktopSkeleton() {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-sm lg:block">
      <Table className="min-w-[860px]">
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {["Producto", "Categoria", "Stock", "Estado", "Variantes", "Acciones"].map((label) => (
              <TableHead
                key={label}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  label === "Acciones" && "text-right"
                )}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={`desktop-skeleton-${index}`} className="border-border">
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-44" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <Skeleton className="h-4 w-10" />
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <Skeleton className="h-9 w-9 rounded-xl" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-3 lg:hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={`mobile-skeleton-${index}`} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-2 h-3 w-24" />
          <div className="mt-3 flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductActions({
  product,
  onDeleteProduct,
}: {
  product: EnrichedProduct;
  onDeleteProduct: (product: EnrichedProduct) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild size="icon" variant="outline" className="h-9 w-9 rounded-xl">
        <Link
          href={`/productos/editar-productos?id=${product.id}`}
          aria-label={`Editar ${product.name}`}
          onClick={stopRowSelection}
          onKeyDown={stopRowSelection}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        type="button"
        size="icon"
        variant="outline"
        aria-label={`Eliminar ${product.name}`}
        className="h-9 w-9 rounded-xl border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
        onClick={(event) => {
          event.stopPropagation();
          onDeleteProduct(product);
        }}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function ProductDesktopRow({
  product,
  isSelected,
  onSelectProduct,
  onDeleteProduct,
}: {
  product: EnrichedProduct;
  isSelected: boolean;
  onSelectProduct: (product: EnrichedProduct) => void;
  onDeleteProduct: (product: EnrichedProduct) => void;
}) {
  const stockState = getProductStockState(product);
  const variantsCount = product.variants?.length ?? 0;

  return (
    <TableRow
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-border transition-colors hover:bg-muted/40",
        isSelected && "bg-accent/50 hover:bg-accent/50"
      )}
      onClick={() => onSelectProduct(product)}
    >
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
      <TableCell className="px-4 py-3 text-sm font-medium text-foreground">{product.totalStock}</TableCell>
      <TableCell className="px-4 py-3">
        <Badge variant="outline" className={stockCopy[stockState].className}>
          {stockCopy[stockState].label}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 text-sm text-muted-foreground">{variantsCount}</TableCell>
      <TableCell className="px-4 py-3">
        <ProductActions product={product} onDeleteProduct={onDeleteProduct} />
      </TableCell>
    </TableRow>
  );
}

function ProductMobileRow({
  product,
  isSelected,
  onSelectProduct,
  onDeleteProduct,
}: {
  product: EnrichedProduct;
  isSelected: boolean;
  onSelectProduct: (product: EnrichedProduct) => void;
  onDeleteProduct: (product: EnrichedProduct) => void;
}) {
  const stockState = getProductStockState(product);
  const variantsCount = product.variants?.length ?? 0;

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-4 shadow-sm transition-colors",
        isSelected ? "border-primary/40 bg-accent/50" : "border-border"
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Seleccionar ${product.name}`}
        aria-pressed={isSelected}
        className="w-full text-left outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onSelectProduct(product)}
        onKeyDown={(event) => handleSelectableKeyDown(event, product, onSelectProduct)}
      >
        <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{product.category || "Sin categoria"}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
            {product.totalStock}
          </span>
          <Badge variant="outline" className={stockCopy[stockState].className}>
            {stockCopy[stockState].label}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
            {variantsCount} variantes
          </span>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <ProductActions product={product} onDeleteProduct={onDeleteProduct} />
      </div>
    </article>
  );
}

export function ProductMasterTable({
  products,
  selectedProductId,
  isLoading,
  hasSearchOrFilters,
  onSelectProduct,
  onDeleteProduct,
}: ProductMasterTableProps) {
  if (isLoading) {
    return (
      <>
        <DesktopSkeleton />
        <MobileSkeleton />
      </>
    );
  }

  if (products.length === 0) {
    return <EmptyState hasSearchOrFilters={hasSearchOrFilters} />;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-sm lg:block">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Producto
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Categoria
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Stock
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Estado
              </TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Variantes
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <ProductDesktopRow
                key={product.id}
                product={product}
                isSelected={selectedProductId === product.id}
                onSelectProduct={onSelectProduct}
                onDeleteProduct={onDeleteProduct}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {products.map((product) => (
          <ProductMobileRow
            key={product.id}
            product={product}
            isSelected={selectedProductId === product.id}
            onSelectProduct={onSelectProduct}
            onDeleteProduct={onDeleteProduct}
          />
        ))}
      </div>
    </>
  );
}

export default ProductMasterTable;
