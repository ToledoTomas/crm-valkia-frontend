export interface StockMovement {
  id: number;
  productVariantId: number;
  type: 'SALE' | 'MANUAL_ADJUSTMENT';
  quantity: number;
  reason: string | null;
  createdAt: string;
}

export interface StockItem {
  id: number;
  productName: string;
  color: string;
  size: string;
  stock: number;
  minStock: number;
  isLow: boolean;
}

export interface CreateStockAdjustmentDto {
  productVariantId: number;
  quantity: number;
  reason?: string;
}

export interface StockAdjustmentResponse {
  variant: {
    id: number;
    productName: string;
    color: string;
    size: string;
    stock: number;
  };
  movement: StockMovement;
}
