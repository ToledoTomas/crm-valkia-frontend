"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Package, History, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getStock, getLowStock, getStockMovements, adjustStock } from "./api";
import { StockItem, StockMovement } from "@/types/stock";

export default function StockPage() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<StockItem | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [showMovements, setShowMovements] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showAdjustment, setShowAdjustment] = useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const [stockResult, lowStock] = await Promise.all([
        getStock(),
        getLowStock(),
      ]);
      setStockItems(stockResult.data);
      setLowStockItems(lowStock);
    } catch (error) {
      toast.error("Error al cargar stock");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewMovements = async (variant: StockItem) => {
    try {
      const movementsData = await getStockMovements(variant.id);
      setMovements(movementsData);
      setSelectedVariant(variant);
      setShowMovements(true);
    } catch (error) {
      toast.error("Error al cargar movimientos");
    }
  };

  const handleAdjustment = async () => {
    if (!selectedVariant) return;

    try {
      await adjustStock({
        productVariantId: selectedVariant.id,
        quantity: adjustmentQuantity,
        reason: adjustmentReason || undefined,
      });
      toast.success("Stock ajustado correctamente");
      setShowAdjustment(false);
      setAdjustmentQuantity(0);
      setAdjustmentReason("");
      fetchData();
    } catch (error) {
      toast.error("Error al ajustar stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Stock</h1>
        <p className="text-gray-500">Gestión de inventario y movimientos</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todo el Stock</TabsTrigger>
          <TabsTrigger value="low" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Stock Bajo
            {lowStockItems.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {lowStockItems.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <StockTable
            items={stockItems}
            isLoading={isLoading}
            onViewMovements={handleViewMovements}
            onAdjust={(item) => {
              setSelectedVariant(item);
              setShowAdjustment(true);
            }}
          />
        </TabsContent>

        <TabsContent value="low" className="mt-6">
          <StockTable
            items={lowStockItems}
            isLoading={isLoading}
            onViewMovements={handleViewMovements}
            onAdjust={(item) => {
              setSelectedVariant(item);
              setShowAdjustment(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de movimientos */}
      <Dialog open={showMovements} onOpenChange={setShowMovements}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historial de Movimientos</DialogTitle>
            <DialogDescription>
              {selectedVariant?.productName} - {selectedVariant?.color} /{" "}
              {selectedVariant?.size}
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Razón</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No hay movimientos registrados
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {new Date(movement.createdAt).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          movement.type === "SALE" ? "default" : "secondary"
                        }
                      >
                        {movement.type === "SALE" ? "Venta" : "Ajuste Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={
                        movement.quantity < 0 ? "text-red-600" : "text-green-600"
                      }
                    >
                      {movement.quantity > 0 ? "+" : ""}
                      {movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reason || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Dialog de ajuste */}
      <Dialog open={showAdjustment} onOpenChange={setShowAdjustment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock</DialogTitle>
            <DialogDescription>
              {selectedVariant?.productName} - {selectedVariant?.color} /{" "}
              {selectedVariant?.size}
              <br />
              Stock actual: {selectedVariant?.stock}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cantidad a ajustar</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustmentQuantity((prev) => prev - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={(e) =>
                    setAdjustmentQuantity(parseInt(e.target.value) || 0)
                  }
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustmentQuantity((prev) => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Use números positivos para agregar, negativos para restar
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Razón (opcional)</label>
              <Input
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="Ej: Reposición de proveedor"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustment(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjustment}>Aplicar Ajuste</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StockTableProps {
  items: StockItem[];
  isLoading: boolean;
  onViewMovements: (item: StockItem) => void;
  onAdjust: (item: StockItem) => void;
}

function StockTable({ items, isLoading, onViewMovements, onAdjust }: StockTableProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Talle</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Mínimo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No hay items para mostrar
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.color}</Badge>
                </TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell className="font-medium">{item.stock}</TableCell>
                <TableCell>{item.minStock}</TableCell>
                <TableCell>
                  {item.isLow ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Bajo
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-500">OK</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewMovements(item)}
                      title="Ver movimientos"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onAdjust(item)}
                      title="Ajustar stock"
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
