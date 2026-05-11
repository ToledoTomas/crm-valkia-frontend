"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getKPIs } from "./api";
import { DashboardKPIs } from "@/types/dashboard";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const kpisRes = await getKPIs();
        setKpis(kpisRes);
      } catch {
        toast.error("Error al cargar datos del dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estado simple del negocio para operar el dia.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Ventas hoy"
          value={formatCurrency(kpis?.salesToday ?? 0)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KPICard
          title="Ventas del mes"
          value={formatCurrency(kpis?.salesThisMonth ?? 0)}
          subtitle={`${kpis?.salesCountThisMonth ?? 0} ventas`}
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <Link href="/productos">
          <KPICard
            title="Productos con atencion"
            value={String(kpis?.lowStockCount ?? 0)}
            icon={<Package className="h-4 w-4" />}
            alert={(kpis?.lowStockCount ?? 0) > 0}
          />
        </Link>
        <Link href="/clientes">
          <KPICard
            title="Clientes nuevos"
            value={`+${kpis?.newCustomersThisMonth ?? 0}`}
            subtitle="Este mes"
            icon={<Users className="h-4 w-4" />}
          />
        </Link>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactElement<{ className?: string }>;
  subtitle?: string;
  alert?: boolean;
}

function KPICard({ title, value, icon, subtitle, alert }: KPICardProps) {
  return (
    <Card className="h-full rounded-2xl border-border shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p
              className={
                alert
                  ? "mt-2 text-2xl font-semibold text-red-600"
                  : "mt-2 text-2xl font-semibold text-foreground"
              }
            >
              {value}
            </p>
            {subtitle ? (
              <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <span
            className={
              alert
                ? "rounded-xl bg-red-50 p-2 text-red-600"
                : "rounded-xl bg-accent p-2 text-primary"
            }
          >
            {React.cloneElement(icon, { className: "h-4 w-4" })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
