import * as api from "@/lib/api";
import {
  EnrichedInvoice,
  CreateInvoiceDto,
} from "@/types/invoice";
import { PaginatedResult } from "@/types/common";

export async function getInvoices(
  page?: number,
  limit?: number
): Promise<PaginatedResult<EnrichedInvoice>> {
  return api.get<{ data: EnrichedInvoice[]; meta: { total: number; page: number; last_page: number } }>("/invoice", { page, limit });
}

export async function getInvoiceById(id: number): Promise<EnrichedInvoice> {
  return api.get<EnrichedInvoice>(`/invoice/${id}`);
}

export async function createInvoice(
  invoice: CreateInvoiceDto
): Promise<EnrichedInvoice> {
  return api.post<EnrichedInvoice>("/invoice", invoice);
}

export async function deleteInvoice(
  id: number
): Promise<{ status: number; message: string }> {
  return api.del<{ status: number; message: string }>(`/invoice/${id}`);
}
