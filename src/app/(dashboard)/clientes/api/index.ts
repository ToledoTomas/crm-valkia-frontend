import * as api from "@/lib/api";
import { EnrichedCustomer, Customer } from "@/types/invoice";
import { PaginatedResult } from "@/types/common";

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  instagram?: string;
  birthday?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  birthday?: string;
}

export async function getCustomers(
  page?: number,
  limit?: number,
  search?: string
): Promise<PaginatedResult<EnrichedCustomer>> {
  return api.get<{ data: EnrichedCustomer[]; meta: { total: number; page: number; last_page: number } }>("/customer", { page, limit, search });
}

export async function getCustomerById(id: number): Promise<EnrichedCustomer> {
  return api.get<EnrichedCustomer>(`/customer/${id}`);
}

export async function searchCustomers(name: string): Promise<EnrichedCustomer[]> {
  return api.get<EnrichedCustomer[]>("/customer/search", { name });
}

export async function createCustomer(
  customer: CreateCustomerDto
): Promise<Customer> {
  return api.post<Customer>("/customer", customer);
}

export async function updateCustomer(
  id: number,
  customer: UpdateCustomerDto
): Promise<Customer> {
  return api.patch<Customer>(`/customer/${id}`, customer);
}

export async function deleteCustomer(
  id: number
): Promise<{ status: number; message: string }> {
  return api.del<{ status: number; message: string }>(`/customer/${id}`);
}
