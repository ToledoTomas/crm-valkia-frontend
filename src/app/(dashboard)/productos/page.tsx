"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Boxes, Layers3, Plus, RefreshCw, Siren } from "lucide-react";
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
import { ProductDetailPanel } from "./_components/ProductDetailPanel";
import { ProductMasterTable } from "./_components/ProductMasterTable";
import {
  filterProducts,
  getCatalogSummary,
  getProductCategories,
  sortProductsForAudit,
  type ProductAuditFilters,
} from "./_lib/product-audit";
import { deleteProduct, getProducts, searchProducts } from "./api";

const initialFilters: ProductAuditFilters = {
  category: "all",
  state: "all",
  stock: "all",
  margin: "all",
};

function hasActiveFilters(filters: ProductAuditFilters) {
  return (
    filters.category !== "all" ||
    filters.state !== "all" ||
    filters.stock !== "all" ||
    filters.margin !== "all"
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Boxes;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-[#eadfce] bg-white/70 px-4 py-3 shadow-[0_14px_40px_rgba(88,60,32,0.05)]">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#a7835d]">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-[#3f2f22]">{value}</p>
    </div>
  );
}

export default function ProductosPage() {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductAuditFilters>(initialFilters);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<EnrichedProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const deletedProductIdsRef = useRef(new Set<number>());
  const didMountSearchEffect = useRef(false);

  const fetchProducts = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      setIsLoading(true);
      setLoadError(null);
      const result = await getProducts();
      if (requestIdRef.current !== requestId) return;
      setProducts(
        result.data.filter((product) => !deletedProductIdsRef.current.has(product.id))
      );
    } catch {
      if (requestIdRef.current !== requestId) return;
      const message = "No se pudo cargar el catalogo.";
      setLoadError(message);
      toast.error(message);
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSearch = useCallback(
    async (term: string) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      try {
        setIsLoading(true);
        setLoadError(null);

        if (term.trim() === "") {
          const result = await getProducts();
          if (requestIdRef.current !== requestId) return;
          setProducts(
            result.data.filter((product) => !deletedProductIdsRef.current.has(product.id))
          );
        } else {
          const result = await searchProducts(term);
          if (requestIdRef.current !== requestId) return;
          setProducts(
            result.filter((product) => !deletedProductIdsRef.current.has(product.id))
          );
        }
      } catch {
        if (requestIdRef.current !== requestId) return;
        const message = "No se pudo buscar productos.";
        setLoadError(message);
        toast.error(message);
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      requestIdRef.current += 1;
      setIsLoading(false);
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      deletedProductIdsRef.current.add(productToDelete.id);
      requestIdRef.current += 1;
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productToDelete.id)
      );
      setSelectedProductId((currentId) =>
        currentId === productToDelete.id ? null : currentId
      );
      toast.success("Producto eliminado correctamente");
      setProductToDelete(null);
    } catch {
      toast.error("Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!didMountSearchEffect.current) {
      didMountSearchEffect.current = true;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [handleSearch, searchTerm]);

  const categories = useMemo(() => getProductCategories(products), [products]);

  const visibleProducts = useMemo(
    () => sortProductsForAudit(filterProducts(products, filters)),
    [filters, products]
  );

  const selectedProduct = useMemo(
    () =>
      visibleProducts.find((product) => product.id === selectedProductId) ??
      visibleProducts[0] ??
      null,
    [selectedProductId, visibleProducts]
  );

  const summary = useMemo(() => getCatalogSummary(visibleProducts), [visibleProducts]);
  const hasSearchOrFilters = searchTerm.trim() !== "" || hasActiveFilters(filters);

  const handleSelectProduct = (product: EnrichedProduct) => {
    setSelectedProductId(product.id);
    setIsMobileDetailOpen(true);
  };

  const retryLastRequest = () => {
    const term = searchTerm.trim();
    if (term) {
      void handleSearch(term);
      return;
    }

    void fetchProducts();
  };

  return (
    <div className="min-w-0 space-y-6">
      <header className="overflow-hidden rounded-[2.5rem] border border-[#eadfce] bg-[#fffaf2] shadow-[0_24px_80px_rgba(88,60,32,0.1)]">
        <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:p-7">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28b61]">
              Atelier operativo
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#2f241b] md:text-5xl">
                  Productos
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7f654c]">
                  Controla catalogo, stock, variantes y margenes desde una vista de
                  lectura rapida.
                </p>
              </div>
              <Button
                asChild
                className="w-full rounded-2xl bg-[#6f5438] text-white hover:bg-[#5e422b] sm:w-auto"
              >
                <Link href="/productos/agregar-productos">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Nuevo producto
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[520px]">
            <SummaryCard icon={Boxes} label="Productos" value={summary.totalProducts} />
            <SummaryCard icon={Layers3} label="Variantes" value={summary.totalVariants} />
            <SummaryCard icon={Siren} label="Atencion" value={summary.attentionCount} />
            <SummaryCard icon={AlertCircle} label="Stock bajo" value={summary.lowStockCount} />
          </div>
        </div>
      </header>

      <ProductControlBar
        searchTerm={searchTerm}
        filters={filters}
        categories={categories}
        onSearchChange={setSearchTerm}
        onFiltersChange={setFilters}
      />

      {loadError ? (
        <div className="flex flex-col gap-3 rounded-3xl border border-[#e8b9a7] bg-[#fff1ea] px-4 py-3 text-sm text-[#842f16] shadow-[0_14px_40px_rgba(132,47,22,0.08)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loadError}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-2xl border-[#e8b9a7] bg-white/70 text-[#842f16] hover:bg-[#ffe6dc]"
            onClick={retryLastRequest}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start">
        <section className="min-w-0 flex-1">
          <ProductMasterTable
            products={visibleProducts}
            selectedProductId={selectedProduct?.id ?? null}
            isLoading={isLoading}
            hasSearchOrFilters={hasSearchOrFilters}
            onSelectProduct={handleSelectProduct}
            onDeleteProduct={setProductToDelete}
          />
        </section>

        <ProductDetailPanel
          product={selectedProduct}
          isMobileOpen={isMobileDetailOpen}
          onMobileOpenChange={setIsMobileDetailOpen}
        />
      </main>

      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Estás por eliminar &quot;{productToDelete?.name}&quot;. Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setProductToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
