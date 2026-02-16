"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { getKPIs, getSalesByMonth, getProfitByMonth, getTopProducts } from "./api";
import { DashboardKPIs, SalesByMonth, ProfitByMonth, TopProduct } from "@/types/dashboard";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [salesData, setSalesData] = useState<SalesByMonth[]>([]);
  const [profitData, setProfitData] = useState<ProfitByMonth[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [kpisRes, salesRes, profitRes, topProductsRes] = await Promise.all([
          getKPIs(),
          getSalesByMonth(),
          getProfitByMonth(),
          getTopProducts(5),
        ]);
        setKpis(kpisRes);
        setSalesData(salesRes);
        setProfitData(profitRes);
        setTopProducts(topProductsRes);
      } catch (error) {
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

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    return `${month}/${year}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Resumen de tu negocio</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ventas Hoy"
          value={formatCurrency(kpis?.salesToday || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          trend="+12%"
          trendUp={true}
        />
        <KPICard
          title="Ventas del Mes"
          value={formatCurrency(kpis?.salesThisMonth || 0)}
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle={`${kpis?.salesCountThisMonth || 0} ventas`}
        />
        <KPICard
          title="Ganancia del Mes"
          value={formatCurrency(kpis?.profitThisMonth || 0)}
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend="Margen saludable"
        />
        <KPICard
          title="Ticket Promedio"
          value={formatCurrency(kpis?.averageTicket || 0)}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <KPICard
          title="Producto Más Vendido"
          value={kpis?.topProduct?.name || "-"}
          icon={<Package className="h-5 w-5" />}
          subtitle={`${kpis?.topProduct?.totalSold || 0} unidades`}
        />
        <Link href="/stock">
          <KPICard
            title="Stock Bajo"
            value={kpis?.lowStockCount?.toString() || "0"}
            icon={<AlertTriangle className="h-5 w-5" />}
            alert={(kpis?.lowStockCount || 0) > 0}
          />
        </Link>
        <KPICard
          title="Clientes Nuevos"
          value={`+${kpis?.newCustomersThisMonth || 0}`}
          icon={<Users className="h-5 w-5" />}
          subtitle="Este mes"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => formatMonth(label as string)}
                />
                <Bar dataKey="total" fill="#e5e5d0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ganancia por Mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ganancia vs Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatMonth}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `$${value / 1000}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => formatMonth(label as string)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="Ingresos"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                  name="Costo"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name="Ganancia"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Productos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Productos Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.totalSold} unidades vendidas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(product.totalRevenue)}
                  </p>
                  <p className="text-sm text-green-600">
                    Ganancia: {formatCurrency(product.totalProfit)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
}

function KPICard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendUp,
  alert,
}: KPICardProps) {
  return (
    <Card className={alert ? "border-red-500" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${alert ? "bg-red-100" : "bg-[#e5e5d0]"}`}>
            {React.cloneElement(icon as React.ReactElement, {
              className: alert ? "text-red-600" : "text-black",
            })}
          </div>
          {trend && (
            <Badge variant={trendUp ? "default" : "destructive"} className="text-xs">
              {trend}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${alert ? "text-red-600" : ""}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
