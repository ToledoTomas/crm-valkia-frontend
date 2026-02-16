import * as api from "@/lib/api";
import { DashboardKPIs, SalesByMonth, ProfitByMonth, TopProduct } from "@/types/dashboard";

export async function getKPIs(): Promise<DashboardKPIs> {
  return api.get<DashboardKPIs>("/dashboard/kpis");
}

export async function getSalesByMonth(): Promise<SalesByMonth[]> {
  return api.get<SalesByMonth[]>("/dashboard/sales-by-month");
}

export async function getProfitByMonth(): Promise<ProfitByMonth[]> {
  return api.get<ProfitByMonth[]>("/dashboard/profit-by-month");
}

export async function getTopProducts(limit?: number): Promise<TopProduct[]> {
  return api.get<TopProduct[]>("/dashboard/top-products", { limit });
}
