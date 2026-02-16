import { EnrichedVariant, Product } from './product';

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productVariantId: number;
  quantity: number;
  priceAtSale: number;
  costAtSale: number;
  productVariant: {
    id: number;
    productId: number;
    color: string;
    size: string;
    cost: number;
    price: number;
    stock: number;
    minStock: number;
    product: Product;
  };
}

export interface Invoice {
  id: number;
  customerId: number | null;
  total: number;
  totalCost: number;
  totalProfit: number;
  createdAt: string;
}

export interface EnrichedInvoice extends Invoice {
  customer: Customer | null;
  items: InvoiceItem[];
}

export interface CreateInvoiceDto {
  customerId?: number;
  items: CreateInvoiceItemDto[];
}

export interface CreateInvoiceItemDto {
  productVariantId: number;
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  birthday: string | null;
  deletedAt: string | null;
  createdAt: string;
}

export interface EnrichedCustomer extends Customer {
  totalSpent: number;
  lastPurchase: string | null;
  orderCount: number;
  classification: CustomerClassification;
}

export type CustomerClassification = 'NUEVO' | 'RECURRENTE' | 'VIP' | 'INACTIVO';
