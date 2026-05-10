"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Layers3,
  PackageOpen,
  Pencil,
  Plus,
  Ruler,
  Shirt,
  Tag,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { EnrichedProduct, EnrichedVariant } from "@/types/product";

import {
  getProductMarginRange,
  getProductMarginState,
  getProductPriceRange,
  getProductStockState,
  type ProductMarginState,
  type ProductStockState,
} from "../_lib/product-audit";

interface ProductDetailPanelProps {
  product: EnrichedProduct | null;
  isMobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

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
    label: "Margen en riesgo",
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

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "-";
  return currencyFormatter.format(value);
}

function getVariantMarginLabel(variant: EnrichedVariant) {
  return Number.isFinite(variant.margen) ? `${variant.margen.toFixed(1)}%` : "-";
}

function getAlertLines(product: EnrichedProduct) {
  const stockState = getProductStockState(product);
  const marginState = getProductMarginState(product);
  const variants = product.variants ?? [];
  const lines: string[] = [];

  if (stockState === "sin-stock") {
    lines.push("Sin unidades disponibles para vender.");
  } else if (stockState === "bajo") {
    const lowVariants = variants.filter((variant) => variant.stock <= variant.minStock);
    lines.push(`${lowVariants.length} variante(s) por debajo del stock minimo.`);
  }

  if (marginState === "riesgo") {
    lines.push("Hay variantes con margen negativo o en cero.");
  } else if (marginState === "bajo") {
    lines.push("Hay variantes con margen menor al 30%.");
  } else if (marginState === "sin-datos") {
    lines.push("Faltan datos de margen para evaluar rentabilidad.");
  }

  if (variants.length === 0) {
    lines.push("Este producto todavia no tiene variantes cargadas.");
  }

  return lines;
}

function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#e5d8c5] bg-[#fffaf2] px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#f1dfc3] text-[#7a4d24]">
        <PackageOpen className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-[#4b3828]">Selecciona un producto</h2>
      <p className="mt-2 max-w-xs text-sm leading-6 text-[#8d7258]">
        El detalle del catalogo aparece aca para revisar stock, margen y variantes sin editar
        datos en linea.
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-6 rounded-2xl border-[#dfcdb8] bg-white/70 text-[#5e422b] hover:bg-[#f8ecdc]"
      >
        <Link href="/productos/agregar-productos">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nuevo producto
        </Link>
      </Button>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-[#eadfce] bg-white/75 p-4 shadow-[0_14px_40px_rgba(88,60,32,0.05)]">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#a7835d]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-3 text-lg font-semibold text-[#3f2f22]">{value}</p>
    </div>
  );
}

function ProductContent({ product }: { product: EnrichedProduct }) {
  const variants = product.variants ?? [];
  const stockState = getProductStockState(product);
  const marginState = getProductMarginState(product);
  const alerts = getAlertLines(product);

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-[#eadfce] bg-[#fffaf2] p-5 shadow-[0_18px_60px_rgba(88,60,32,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28b61]">
              Detalle operativo
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#3f2f22]">
              {product.name}
            </h2>
          </div>
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
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="border-[#dfcdb8] bg-white/80 text-[#6f5438]">
            <Tag className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            {product.category || "Sin categoria"}
          </Badge>
          <Badge variant="outline" className={stockCopy[stockState].className}>
            {stockCopy[stockState].label}
          </Badge>
          <Badge variant="outline" className={marginCopy[marginState].className}>
            {marginCopy[marginState].label}
          </Badge>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#7f654c]">
          {product.description?.trim() || "Sin descripcion cargada para este producto."}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <MetricCard icon={Boxes} label="Stock" value={String(product.totalStock)} />
        <MetricCard icon={Layers3} label="Variantes" value={String(variants.length)} />
        <MetricCard icon={CircleDollarSign} label="Precio" value={getProductPriceRange(product)} />
        <MetricCard icon={Ruler} label="Margen" value={getProductMarginRange(product)} />
      </section>

      {alerts.length > 0 && (
        <section className="rounded-3xl border border-[#ecd6bf] bg-[#fff6ea] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#7a4d24]">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Puntos de atencion
          </div>
          <div className="mt-3 space-y-2">
            {alerts.map((line) => (
              <p key={line} className="rounded-2xl bg-white/70 px-3 py-2 text-sm text-[#745337]">
                {line}
              </p>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[2rem] border border-[#eadfce] bg-white/75 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a4d24]">
              Variantes
            </h3>
            <p className="mt-1 text-xs text-[#9a8064]">Color, talle y rentabilidad</p>
          </div>
          <Shirt className="h-5 w-5 text-[#b28b61]" aria-hidden="true" />
        </div>

        {variants.length > 0 ? (
          <div className="mt-4 space-y-3">
            {variants.map((variant) => {
              const isLowStock = variant.stock <= variant.minStock;

              return (
                <article
                  key={variant.id}
                  className="rounded-3xl border border-[#efe3d3] bg-[#fffaf2] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-[#dfcdb8] bg-white text-[#60462d]"
                        >
                          {variant.color || "Sin color"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-[#dfcdb8] bg-white text-[#60462d]"
                        >
                          Talle {variant.size || "-"}
                        </Badge>
                      </div>
                      <p className="mt-3 text-xs text-[#9a8064]">
                        Costo {formatCurrency(variant.cost)} / Precio{" "}
                        {formatCurrency(variant.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          isLowStock
                            ? "text-sm font-semibold text-[#9b3d1f]"
                            : "text-sm font-semibold text-[#476126]"
                        }
                      >
                        {variant.stock} u.
                      </p>
                      <p className="mt-1 text-xs text-[#9a8064]">min. {variant.minStock}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#745337]">
                    <span className="rounded-2xl bg-white/75 px-3 py-2">
                      Margen {getVariantMarginLabel(variant)}
                    </span>
                    <span className="rounded-2xl bg-white/75 px-3 py-2">
                      Ganancia {formatCurrency(variant.ganancia)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-[#e5d8c5] bg-[#fffaf2] p-5 text-sm leading-6 text-[#7f654c]">
            No hay variantes para auditar. Agrega una variante desde la edicion del producto.
          </div>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Button
          asChild
          className="rounded-2xl bg-[#6f5438] text-white hover:bg-[#5e422b]"
        >
          <Link href={`/productos/editar-productos?id=${product.id}`}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Editar producto
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-2xl border-[#dfcdb8] bg-white/80 text-[#5e422b] hover:bg-[#f8ecdc]"
        >
          <Link href="/productos/agregar-productos">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nuevo producto
          </Link>
        </Button>
      </section>
    </div>
  );
}

function PanelBody({ product }: { product: EnrichedProduct | null }) {
  return product ? <ProductContent product={product} /> : <EmptyState />;
}

function useIsMobileDetailViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

export function ProductDetailPanel({
  product,
  isMobileOpen,
  onMobileOpenChange,
}: ProductDetailPanelProps) {
  const isMobileViewport = useIsMobileDetailViewport();

  useEffect(() => {
    if (!isMobileViewport && isMobileOpen) {
      onMobileOpenChange(false);
    }
  }, [isMobileOpen, isMobileViewport, onMobileOpenChange]);

  return (
    <>
      <aside className="hidden lg:block lg:w-[380px] lg:shrink-0">
        <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto pr-1">
          <PanelBody product={product} />
        </div>
      </aside>

      {isMobileViewport ? (
        <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
          <SheetContent
            side="bottom"
            className="max-h-[88vh] overflow-y-auto rounded-t-[2rem] border-[#eadfce] bg-[#fffaf2] p-0"
          >
            <SheetHeader className="border-b border-[#eadfce] px-5 py-4 text-left">
              <SheetTitle className="pr-8 text-[#3f2f22]">
                {product ? product.name : "Detalle de producto"}
              </SheetTitle>
              <SheetDescription className="text-[#8d7258]">
                Vista de lectura para stock, margen y variantes.
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-6">
              <PanelBody product={product} />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </>
  );
}

export default ProductDetailPanel;
