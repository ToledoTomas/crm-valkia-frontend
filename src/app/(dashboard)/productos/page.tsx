"use client";

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

const initialFilters: ProductStockFilters = {
  category: "all",
  stock: "all",
};

function hasActiveFilters(filters: ProductStockFilters) {
  return filters.category !== "all" || filters.stock !== "all";
}

export default function ProductosPage() {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductStockFilters>(initialFilters);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
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

  const handleSearch = useCallback(async (term: string) => {
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
  }, []);

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
    () => sortProductsForStock(filterProducts(products, filters)),
    [filters, products]
  );

  const summary = useMemo(() => getCatalogStockSummary(visibleProducts), [visibleProducts]);
  const hasSearchOrFilters = searchTerm.trim() !== "" || hasActiveFilters(filters);

  const handleSelectProduct = (product: EnrichedProduct) => {
    setSelectedProductId(product.id);
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
              {summary.totalProducts} productos cargados - {summary.attentionCount} requieren
              atencion
            </p>
          </div>
          <Button
            asChild
            className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/productos/agregar-productos">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nuevo producto
            </Link>
          </Button>
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
        <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{loadError}</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={retryLastRequest}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      ) : null}

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

      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open) setProductToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar producto?</DialogTitle>
            <DialogDescription>
              Estas por eliminar &quot;{productToDelete?.name}&quot;. Esta accion no se puede
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
