import * as api from "@/lib/api";
import {
  EnrichedProduct,
  EnrichedVariant,
  CreateProductDto,
  UpdateProductDto,
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/types/product";
import { PaginatedResult } from "@/types/common";

export async function getProducts(
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginatedResult<EnrichedProduct>> {
  return api.get<{
    data: EnrichedProduct[];
    meta: { total: number; page: number; last_page: number };
  }>("/products", { page, limit, search });
}

export async function getProductById(id: number): Promise<EnrichedProduct> {
  return api.get<EnrichedProduct>(`/products/${id}`);
}

export async function searchProducts(name: string): Promise<EnrichedProduct[]> {
  return api.get<EnrichedProduct[]>("/products/search", { name });
}

export async function createProduct(
  product: CreateProductDto
): Promise<EnrichedProduct> {
  return api.post<EnrichedProduct>("/products", product);
}

export async function updateProduct(
  id: number,
  product: UpdateProductDto
): Promise<EnrichedProduct> {
  return api.patch<EnrichedProduct>(`/products/${id}`, product);
}

export async function deleteProduct(
  id: number
): Promise<{ status: number; message: string }> {
  return api.del<{ status: number; message: string }>(`/products/${id}`);
}

export async function addVariant(
  productId: number,
  variant: CreateProductVariantDto
): Promise<EnrichedVariant> {
  return api.post<EnrichedVariant>(`/products/${productId}/variants`, variant);
}

export async function updateVariant(
  variantId: number,
  variant: UpdateProductVariantDto
): Promise<EnrichedVariant> {
  return api.patch<EnrichedVariant>(
    `/products/variants/${variantId}`,
    variant
  );
}

export async function deleteVariant(
  variantId: number
): Promise<{ status: number; message: string }> {
  return api.del<{ status: number; message: string }>(
    `/products/variants/${variantId}`
  );
}
