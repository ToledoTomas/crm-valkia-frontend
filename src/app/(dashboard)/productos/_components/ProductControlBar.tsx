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
import type { ProductAuditFilters } from "../_lib/product-audit";

interface ProductControlBarProps {
  searchTerm: string;
  filters: ProductAuditFilters;
  categories: string[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ProductAuditFilters) => void;
}

const stateOptions: Array<{ value: ProductAuditFilters["state"]; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "inactive", label: "Inactivos" },
];

const stockOptions: Array<{ value: ProductAuditFilters["stock"]; label: string }> = [
  { value: "all", label: "Todo stock" },
  { value: "sin-stock", label: "Sin stock" },
  { value: "bajo", label: "Stock bajo" },
  { value: "ok", label: "Stock ok" },
];

const marginOptions: Array<{ value: ProductAuditFilters["margin"]; label: string }> = [
  { value: "all", label: "Todo margen" },
  { value: "riesgo", label: "En riesgo" },
  { value: "bajo", label: "Margen bajo" },
  { value: "ok", label: "Margen ok" },
  { value: "sin-datos", label: "Sin datos" },
];

export function ProductControlBar({
  searchTerm,
  filters,
  categories,
  onSearchChange,
  onFiltersChange,
}: ProductControlBarProps) {
  const updateFilter = <Key extends keyof ProductAuditFilters>(
    key: Key,
    value: ProductAuditFilters[Key]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <section className="rounded-3xl border border-[#eadfce] bg-[#fffaf2] p-4 shadow-[0_18px_60px_rgba(88,60,32,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 text-[#6f5438] lg:w-44">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1dfc3] text-[#7a4d24]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Controles</p>
            <p className="mt-1 text-xs text-[#9a8064]">Auditoria catalogo</p>
          </div>
        </div>

        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a7835d]"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Buscar productos"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por producto, color o talle"
            className="h-11 rounded-2xl border-[#eadfce] bg-white/80 pl-10 text-[#4b3828] placeholder:text-[#ad9a85] focus-visible:ring-[#c9894b]"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-[620px] lg:grid-cols-4">
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger
              aria-label="Filtrar por categoria"
              className="h-11 rounded-2xl border-[#eadfce] bg-white/80 text-[#4b3828] focus:ring-[#c9894b]"
            >
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
            value={filters.state}
            onValueChange={(value) =>
              updateFilter("state", value as ProductAuditFilters["state"])
            }
          >
            <SelectTrigger
              aria-label="Filtrar por estado"
              className="h-11 rounded-2xl border-[#eadfce] bg-white/80 text-[#4b3828] focus:ring-[#c9894b]"
            >
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.stock}
            onValueChange={(value) =>
              updateFilter("stock", value as ProductAuditFilters["stock"])
            }
          >
            <SelectTrigger
              aria-label="Filtrar por stock"
              className="h-11 rounded-2xl border-[#eadfce] bg-white/80 text-[#4b3828] focus:ring-[#c9894b]"
            >
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

          <Select
            value={filters.margin}
            onValueChange={(value) =>
              updateFilter("margin", value as ProductAuditFilters["margin"])
            }
          >
            <SelectTrigger
              aria-label="Filtrar por margen"
              className="h-11 rounded-2xl border-[#eadfce] bg-white/80 text-[#4b3828] focus:ring-[#c9894b]"
            >
              <SelectValue placeholder="Margen" />
            </SelectTrigger>
            <SelectContent>
              {marginOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}

export default ProductControlBar;
