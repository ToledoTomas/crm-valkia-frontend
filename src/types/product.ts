export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  size: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
}

export interface EnrichedVariant extends ProductVariant {
  ganancia: number;
  margen: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string | null;
  active: boolean;
  createdAt: string;
}

export interface EnrichedProduct extends Product {
  totalStock: number;
  variants: EnrichedVariant[];
}

export interface CreateProductDto {
  name: string;
  category: string;
  description?: string;
  active?: boolean;
  variants?: CreateProductVariantDto[];
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  description?: string;
  active?: boolean;
}

export interface CreateProductVariantDto {
  color: string;
  size: string;
  cost: number;
  price: number;
  stock: number;
  minStock?: number;
}

export interface UpdateProductVariantDto {
  color?: string;
  size?: string;
  cost?: number;
  price?: number;
  stock?: number;
  minStock?: number;
}
