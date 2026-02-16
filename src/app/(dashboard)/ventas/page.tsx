"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Trash2, User, Calendar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

import { getInvoices, deleteInvoice } from "./api";
import { EnrichedInvoice } from "@/types/invoice";

export default function VentasPage() {
  const [invoices, setInvoices] = useState<EnrichedInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceToDelete, setInvoiceToDelete] = useState<EnrichedInvoice | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<EnrichedInvoice | null>(null);

  const fetchInvoices = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getInvoices();
      setInvoices(result.data);
    } catch (error) {
      toast.error("Error al cargar ventas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    try {
      await deleteInvoice(invoiceToDelete.id);
      setInvoices(invoices.filter((i) => i.id !== invoiceToDelete.id));
      toast.success("Venta anulada correctamente. El stock ha sido revertido.");
      setInvoiceToDelete(null);
    } catch (error) {
      toast.error("Error al anular la venta");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Ventas</h1>
          <p className="text-gray-500">Historial de ventas y transacciones</p>
        </div>
        <Link href="/ventas/nueva">
          <Button className="bg-[#e5e5d0] hover:bg-[#d8d8b9] text-black">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Venta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ganancia</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No hay ventas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {invoice.customer ? (
                          <span>{invoice.customer.name}</span>
                        ) : (
                          <span className="text-gray-400 italic">Sin cliente</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(invoice.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.items?.length || 0} items</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(invoice.totalProfit)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setInvoiceToDelete(invoice)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog de confirmación para anular */}
      <Dialog open={!!invoiceToDelete} onOpenChange={() => setInvoiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Anular venta?</DialogTitle>
            <DialogDescription>
              Estás a punto de anular la venta #{invoiceToDelete?.id}. Esto revertirá el stock de los productos vendidos. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Anular Venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalle de venta */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalle de Venta #{selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.customer ? (
                <span>Cliente: {selectedInvoice.customer.name}</span>
              ) : (
                <span className="italic">Venta sin cliente</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">
                  {selectedInvoice && formatCurrency(selectedInvoice.total)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Costo</p>
                <p className="text-xl">
                  {selectedInvoice && formatCurrency(selectedInvoice.totalCost)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ganancia</p>
                <p className="text-xl text-green-600">
                  {selectedInvoice && formatCurrency(selectedInvoice.totalProfit)}
                </p>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Variante</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoice?.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.productVariant.product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.productVariant.color}</Badge>{" "}
                      <span className="text-sm">{item.productVariant.size}</span>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.priceAtSale)}</TableCell>
                    <TableCell>
                      {formatCurrency(item.quantity * item.priceAtSale)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
