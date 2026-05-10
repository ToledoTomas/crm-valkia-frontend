import { EnrichedProduct, EnrichedVariant } from "@/types/product";

export type ProductStockState = "sin-stock" | "bajo" | "ok";
export type ProductMarginState = "riesgo" | "bajo" | "ok" | "sin-datos";
export type ProductFilterState = "all" | "active" | "inactive";
export type ProductStockFilter = "all" | ProductStockState;
export type ProductMarginFilter = "all" | ProductMarginState;

export interface ProductAuditFilters {
  category: string;
  state: ProductFilterState;
  stock: ProductStockFilter;
  margin: ProductMarginFilter;
}

export interface CatalogSummary {
  totalProducts: number;
  totalVariants: number;
  attentionCount: number;
  lowStockCount: number;
}

export function getVariantMarginState(variant: EnrichedVariant): ProductMarginState {
  if (!Number.isFinite(variant.margen)) return "sin-datos";
  if (variant.margen <= 0) return "riesgo";
  if (variant.margen < 30) return "bajo";
  return "ok";
}

export function getProductStockState(product: EnrichedProduct): ProductStockState {
  const variants = product.variants ?? [];
  if (variants.length === 0 || product.totalStock <= 0) return "sin-stock";
  if (variants.some((variant) => variant.stock <= variant.minStock)) return "bajo";
  return "ok";
}

export function getProductMarginState(product: EnrichedProduct): ProductMarginState {
  const variants = product.variants ?? [];
  if (variants.length === 0) return "sin-datos";
  const marginStates = variants.map(getVariantMarginState);
  if (marginStates.includes("riesgo")) return "riesgo";
  if (marginStates.includes("bajo")) return "bajo";
  if (marginStates.includes("sin-datos")) return "sin-datos";
  return "ok";
}

export function getProductAttentionScore(product: EnrichedProduct): number {
  let score = 0;
  const stockState = getProductStockState(product);
  const marginState = getProductMarginState(product);

  if (!product.active) score += 2;
  if ((product.variants ?? []).length === 0) score += 4;
  if (stockState === "sin-stock") score += 4;
  if (stockState === "bajo") score += 3;
  if (marginState === "riesgo") score += 3;
  if (marginState === "bajo") score += 1;

  return score;
}

export function getProductPriceRange(product: EnrichedProduct): string {
  const prices = (product.variants ?? [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) return "-";

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  return min === max ? formatter.format(min) : `${formatter.format(min)} - ${formatter.format(max)}`;
}

export function getProductMarginRange(product: EnrichedProduct): string {
  const margins = (product.variants ?? [])
    .map((variant) => Number(variant.margen))
    .filter((margin) => Number.isFinite(margin));

  if (margins.length === 0) return "-";

  const min = Math.min(...margins);
  const max = Math.max(...margins);
  return min === max ? `${min.toFixed(1)}%` : `${min.toFixed(1)}% - ${max.toFixed(1)}%`;
}

export function getProductCategories(products: EnrichedProduct[]): string[] {
  return Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort();
}

export function getCatalogSummary(products: EnrichedProduct[]): CatalogSummary {
  return products.reduce<CatalogSummary>(
    (summary, product) => {
      const stockState = getProductStockState(product);
      const score = getProductAttentionScore(product);

      summary.totalProducts += 1;
      summary.totalVariants += product.variants?.length ?? 0;
      summary.attentionCount += score > 0 ? 1 : 0;
      summary.lowStockCount += stockState === "bajo" || stockState === "sin-stock" ? 1 : 0;

      return summary;
    },
    {
      totalProducts: 0,
      totalVariants: 0,
      attentionCount: 0,
      lowStockCount: 0,
    }
  );
}

export function filterProducts(
  products: EnrichedProduct[],
  filters: ProductAuditFilters
): EnrichedProduct[] {
  return products.filter((product) => {
    if (filters.category !== "all" && product.category !== filters.category) return false;
    if (filters.state === "active" && !product.active) return false;
    if (filters.state === "inactive" && product.active) return false;
    if (filters.stock !== "all" && getProductStockState(product) !== filters.stock) return false;
    if (filters.margin !== "all" && getProductMarginState(product) !== filters.margin) return false;
    return true;
  });
}

export function sortProductsForAudit(products: EnrichedProduct[]): EnrichedProduct[] {
  return [...products].sort((a, b) => {
    const scoreDiff = getProductAttentionScore(b) - getProductAttentionScore(a);
    if (scoreDiff !== 0) return scoreDiff;
    return a.name.localeCompare(b.name, "es");
  });
}
