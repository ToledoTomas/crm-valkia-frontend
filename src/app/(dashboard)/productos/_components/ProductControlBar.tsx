"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductStockFilters } from "../_lib/product-audit";

interface ProductControlBarProps {
  searchTerm: string;
  filters: ProductStockFilters;
  categories: string[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ProductStockFilters) => void;
}

const stockOptions: Array<{ value: ProductStockFilters["stock"]; label: string }> = [
  { value: "all", label: "Todo stock" },
  { value: "sin-stock", label: "Sin stock" },
  { value: "bajo", label: "Stock bajo" },
  { value: "ok", label: "Stock ok" },
];

export function ProductControlBar({
  searchTerm,
  filters,
  categories,
  onSearchChange,
  onFiltersChange,
}: ProductControlBarProps) {
  const updateFilter = <Key extends keyof ProductStockFilters>(
    key: Key,
    value: ProductStockFilters[Key]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px] lg:items-center">
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Buscar productos"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar producto, categoria, color o talle"
            className="h-10 rounded-xl border-border bg-background pl-10 text-sm"
          />
        </div>

        <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
          <SelectTrigger aria-label="Filtrar por categoria" className="h-10 rounded-xl border-border bg-background">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.stock}
          onValueChange={(value) => updateFilter("stock", value as ProductStockFilters["stock"])}
        >
          <SelectTrigger aria-label="Filtrar por stock" className="h-10 rounded-xl border-border bg-background">
            <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            {stockOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}

export default ProductControlBar;
