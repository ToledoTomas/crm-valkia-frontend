import * as api from "@/lib/api";
import { StockItem, StockMovement, CreateStockAdjustmentDto, StockAdjustmentResponse } from "@/types/stock";
import { PaginatedResult } from "@/types/common";

export async function getStock(
  page?: number,
  limit?: number
): Promise<PaginatedResult<StockItem>> {
  return api.get<{ data: StockItem[]; meta: { total: number; page: number; last_page: number } }>("/stock", { page, limit });
}

export async function getLowStock(): Promise<StockItem[]> {
  return api.get<StockItem[]>("/stock/low");
}

export async function getStockMovements(variantId: number): Promise<StockMovement[]> {
  return api.get<StockMovement[]>(`/stock/movements/${variantId}`);
}

export async function adjustStock(
  adjustment: CreateStockAdjustmentDto
): Promise<StockAdjustmentResponse> {
  return api.post<StockAdjustmentResponse>("/stock/adjust", adjustment);
}
