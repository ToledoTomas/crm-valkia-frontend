export interface DashboardKPIs {
  salesToday: number;
  salesThisMonth: number;
  salesCountThisMonth: number;
  profitThisMonth: number;
  averageTicket: number;
  topProduct: {
    name: string;
    totalSold: number;
  };
  lowStockCount: number;
  newCustomersThisMonth: number;
}

export interface SalesByMonth {
  month: string;
  total: number;
  count: number;
}

export interface ProfitByMonth {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

export interface TopProduct {
  id: number;
  name: string;
  totalSold: number;
  totalRevenue: number;
  totalProfit: number;
}
