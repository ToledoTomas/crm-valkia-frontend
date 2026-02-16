"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Package, Users, Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportesPage() {
  const [isLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-gray-500">Análisis y reportes de tu negocio</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      <Tabs defaultValue="profitability" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profitability" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Rentabilidad
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ventas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rentabilidad por Producto</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64" />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Los datos de rentabilidad se cargarán aquí</p>
                  <p className="text-sm">Esta funcionalidad estará disponible pronto</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Productos sin Rotación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Análisis de rotación de productos</p>
                <p className="text-sm">Esta funcionalidad estará disponible pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Ranking de clientes por gasto</p>
                <p className="text-sm">Esta funcionalidad estará disponible pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Reporte de ventas detallado</p>
                <p className="text-sm">Esta funcionalidad estará disponible pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
