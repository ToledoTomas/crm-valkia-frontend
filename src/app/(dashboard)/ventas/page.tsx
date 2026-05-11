"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Eye, Plus, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EnrichedInvoice } from "@/types/invoice";

import { deleteInvoice, getInvoices } from "./api";

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
    } catch {
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
      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceToDelete.id));
      toast.success("Venta anulada correctamente. El stock ha sido revertido.");
      setInvoiceToDelete(null);
    } catch {
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
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Ventas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Historial simple de ventas registradas.
            </p>
          </div>
          <Button
            asChild
            className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/ventas/nueva">
              <Plus className="h-4 w-4" />
              Nueva venta
            </Link>
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Venta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
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
                          <span className="italic text-gray-400">Sin cliente</span>
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

      <Dialog open={!!invoiceToDelete} onOpenChange={() => setInvoiceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anular venta?</DialogTitle>
            <DialogDescription>
              Estas por anular la venta #{invoiceToDelete?.id}. Esto revertira el stock
              de los productos vendidos.
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
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {selectedInvoice && formatCurrency(selectedInvoice.total)}
              </p>
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
