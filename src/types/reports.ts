import { EnrichedInvoice } from './invoice';

export interface ProductProfitability {
  id: number;
  name: string;
  category: string;
  totalSold: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  margin: number;
}

export interface CategoryProfitability {
  category: string;
  totalSold: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  margin: number;
}

export interface NoRotationProduct {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  lastSaleDate: string | null;
  daysSinceLastSale: number | null;
  neverSold: boolean;
}

export interface TopSpender {
  id: number;
  name: string;
  phone: string | null;
  instagram: string | null;
  totalSpent: number;
  orderCount: number;
  avgTicket: number;
}

export interface SalesReport {
  summary: {
    count: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    avgTicket: number;
  };
  invoices: EnrichedInvoice[];
}
