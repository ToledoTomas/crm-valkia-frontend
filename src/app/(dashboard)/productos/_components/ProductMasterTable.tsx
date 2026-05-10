"use client";

import Link from "next/link";
import type { KeyboardEvent, MouseEvent } from "react";
import { Boxes, CircleDollarSign, Layers3, PackageOpen, Pencil, SearchX, Trash2 } from "lucide-react";

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

import {
  getProductMarginRange,
  getProductMarginState,
  getProductPriceRange,
  getProductStockState,
  type ProductMarginState,
  type ProductStockState,
} from "../_lib/product-audit";

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
    className: "border-[#e8b9a7] bg-[#fff1ea] text-[#9b3d1f]",
  },
  bajo: {
    label: "Stock bajo",
    className: "border-[#e8d19b] bg-[#fff7df] text-[#7a5214]",
  },
  ok: {
    label: "Stock ok",
    className: "border-[#cfdcbc] bg-[#f4f8ea] text-[#476126]",
  },
};

const marginCopy: Record<ProductMarginState, { label: string; className: string }> = {
  riesgo: {
    label: "En riesgo",
    className: "border-[#e8b9a7] bg-[#fff1ea] text-[#9b3d1f]",
  },
  bajo: {
    label: "Margen bajo",
    className: "border-[#e8d19b] bg-[#fff7df] text-[#7a5214]",
  },
  ok: {
    label: "Margen ok",
    className: "border-[#cfdcbc] bg-[#f4f8ea] text-[#476126]",
  },
  "sin-datos": {
    label: "Sin datos",
    className: "border-[#e2d6c7] bg-[#f8f0e4] text-[#7c6750]",
  },
};

function stopRowSelection(event: MouseEvent | KeyboardEvent) {
  event.stopPropagation();
}

function isFromInteractiveElement(event: MouseEvent | KeyboardEvent) {
  const target = event.target;
  return target instanceof HTMLElement
    ? Boolean(target.closest("a, button, input, select, textarea, [role='button']"))
    : false;
}

function handleSelectableKeyDown(
  event: KeyboardEvent,
  product: EnrichedProduct,
  onSelectProduct: (product: EnrichedProduct) => void
) {
  if (isFromInteractiveElement(event)) return;
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onSelectProduct(product);
}

function EmptyState({ hasSearchOrFilters }: { hasSearchOrFilters: boolean }) {
  const Icon = hasSearchOrFilters ? SearchX : PackageOpen;

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#e5d8c5] bg-[#fffaf2] px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#f1dfc3] text-[#7a4d24]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-[#4b3828]">
        {hasSearchOrFilters ? "Sin coincidencias" : "Sin productos cargados"}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#8d7258]">
        {hasSearchOrFilters
          ? "No hay productos que coincidan con la busqueda o los filtros activos."
          : "Todavia no hay productos para auditar. Carga el primer producto para revisar stock, margen y variantes."}
      </p>
    </div>
  );
}

function DesktopSkeleton() {
  return (
    <div className="hidden overflow-x-auto rounded-[2rem] border border-[#eadfce] bg-[#fffaf2] shadow-[0_18px_60px_rgba(88,60,32,0.08)] lg:block">
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow className="border-[#eadfce] hover:bg-transparent">
            {["Producto", "Categoria", "Stock", "Variantes", "Precio", "Margen", "Estado", ""].map(
              (label) => (
                <TableHead key={label} className="px-4 py-4 text-[#8d7258]">
                  {label}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={`desktop-skeleton-${index}`} className="border-[#efe3d3]">
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-44 bg-[#eadfce]" />
                <Skeleton className="mt-2 h-3 w-28 bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-24 bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-6 w-28 rounded-full bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-12 bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-24 bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-5 w-24 bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <Skeleton className="h-6 w-20 rounded-full bg-[#eadfce]" />
              </TableCell>
              <TableCell className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9 rounded-2xl bg-[#eadfce]" />
                  <Skeleton className="h-9 w-9 rounded-2xl bg-[#eadfce]" />
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
        <div
          key={`mobile-skeleton-${index}`}
          className="rounded-[1.75rem] border border-[#eadfce] bg-[#fffaf2] p-4"
        >
          <Skeleton className="h-5 w-44 bg-[#eadfce]" />
          <Skeleton className="mt-2 h-3 w-28 bg-[#eadfce]" />
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Skeleton className="h-16 rounded-2xl bg-[#eadfce]" />
            <Skeleton className="h-16 rounded-2xl bg-[#eadfce]" />
            <Skeleton className="h-16 rounded-2xl bg-[#eadfce]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateBadge({ product }: { product: EnrichedProduct }) {
  return (
    <Badge
      variant="outline"
      className={
        product.active
          ? "border-[#cfdcbc] bg-[#f4f8ea] text-[#476126]"
          : "border-[#ded2c1] bg-[#f1eadf] text-[#7c6750]"
      }
    >
      {product.active ? "Activo" : "Inactivo"}
    </Badge>
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
      <Button
        asChild
        size="icon"
        variant="outline"
        className="h-9 w-9 rounded-2xl border-[#dfcdb8] bg-white/80 text-[#5e422b] hover:bg-[#f8ecdc]"
      >
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
        className="h-9 w-9 rounded-2xl border-[#e8b9a7] bg-[#fff1ea] text-[#9b3d1f] hover:bg-[#ffe6dc] hover:text-[#842f16]"
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
  const marginState = getProductMarginState(product);
  const variantsCount = product.variants?.length ?? 0;

  return (
    <TableRow
      tabIndex={0}
      role="button"
      aria-label={`Ver detalle de ${product.name}`}
      aria-pressed={isSelected}
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-[#efe3d3] outline-none transition-colors hover:bg-[#fff6ea] focus-visible:bg-[#fff6ea] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c9894b]",
        isSelected && "bg-[#f8ecdc] hover:bg-[#f8ecdc]"
      )}
      onClick={(event) => {
        if (!isFromInteractiveElement(event)) {
          onSelectProduct(product);
        }
      }}
      onKeyDown={(event) => handleSelectableKeyDown(event, product, onSelectProduct)}
    >
      <TableCell className="px-4 py-4">
        <div className="max-w-[260px]">
          <p className="truncate font-semibold text-[#3f2f22]">{product.name}</p>
          <p className="mt-1 truncate text-xs text-[#9a8064]">
            {product.description?.trim() || "Sin descripcion"}
          </p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 text-[#6f5438]">
        {product.category || "Sin categoria"}
      </TableCell>
      <TableCell className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className={stockCopy[stockState].className}>
            {stockCopy[stockState].label}
          </Badge>
          <span className="text-xs text-[#9a8064]">{product.totalStock} unidades</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-4 font-medium text-[#4b3828]">{variantsCount}</TableCell>
      <TableCell className="px-4 py-4 font-medium text-[#4b3828]">
        {getProductPriceRange(product)}
      </TableCell>
      <TableCell className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[#4b3828]">{getProductMarginRange(product)}</span>
          <Badge variant="outline" className={marginCopy[marginState].className}>
            {marginCopy[marginState].label}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="px-4 py-4">
        <StateBadge product={product} />
      </TableCell>
      <TableCell className="px-4 py-4">
        <ProductActions product={product} onDeleteProduct={onDeleteProduct} />
      </TableCell>
    </TableRow>
  );
}

function ProductMobileCard({
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
  const marginState = getProductMarginState(product);
  const variantsCount = product.variants?.length ?? 0;

  return (
    <article
      className={cn(
        "rounded-[1.75rem] border bg-[#fffaf2] p-4 shadow-[0_14px_45px_rgba(88,60,32,0.06)] transition-colors",
        isSelected ? "border-[#c9894b] bg-[#f8ecdc]" : "border-[#eadfce]"
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Ver detalle de ${product.name}`}
        aria-pressed={isSelected}
        className="w-full text-left outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[#c9894b]"
        onClick={() => onSelectProduct(product)}
        onKeyDown={(event) => handleSelectableKeyDown(event, product, onSelectProduct)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#3f2f22]">{product.name}</p>
            <p className="mt-1 text-xs text-[#9a8064]">
              {product.category || "Sin categoria"}
            </p>
          </div>
          <StateBadge product={product} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-left">
          <div className="rounded-2xl bg-white/75 p-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a7835d]">
              <Boxes className="h-3.5 w-3.5" aria-hidden="true" />
              Stock
            </div>
            <p className="mt-2 text-sm font-semibold text-[#4b3828]">{product.totalStock}</p>
          </div>
          <div className="rounded-2xl bg-white/75 p-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a7835d]">
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              Var.
            </div>
            <p className="mt-2 text-sm font-semibold text-[#4b3828]">{variantsCount}</p>
          </div>
          <div className="rounded-2xl bg-white/75 p-3">
            <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a7835d]">
              <CircleDollarSign className="h-3.5 w-3.5" aria-hidden="true" />
              Precio
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-[#4b3828]">
              {getProductPriceRange(product)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className={stockCopy[stockState].className}>
            {stockCopy[stockState].label}
          </Badge>
          <Badge variant="outline" className={marginCopy[marginState].className}>
            {getProductMarginRange(product)} / {marginCopy[marginState].label}
          </Badge>
        </div>
      </div>

      <div className="mt-4 border-t border-[#eadfce] pt-3">
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
      <div className="hidden overflow-x-auto rounded-[2rem] border border-[#eadfce] bg-[#fffaf2] shadow-[0_18px_60px_rgba(88,60,32,0.08)] lg:block">
        <Table className="min-w-[980px]">
          <TableHeader>
            <TableRow className="border-[#eadfce] bg-[#f8ecdc] hover:bg-[#f8ecdc]">
              <TableHead className="px-4 py-4 text-[#7a4d24]">Producto</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Categoria</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Stock</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Variantes</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Precio</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Margen</TableHead>
              <TableHead className="px-4 py-4 text-[#7a4d24]">Estado</TableHead>
              <TableHead className="px-4 py-4 text-right text-[#7a4d24]">Acciones</TableHead>
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
          <ProductMobileCard
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
