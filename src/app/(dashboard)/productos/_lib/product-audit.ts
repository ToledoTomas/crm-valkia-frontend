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

export function getProductStockState(product: EnrichedProduct): ProductStockState {
  const variants = product.variants ?? [];
  if (variants.length === 0 || product.totalStock <= 0) return "sin-stock";
  if (variants.some((variant) => variant.stock <= variant.minStock)) return "bajo";
  return "ok";
}

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
