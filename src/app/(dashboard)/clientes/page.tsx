"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Edit2, Phone, Plus, Search, Trash2, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { deleteCustomer, getCustomers } from "./api";
import { EnrichedCustomer } from "@/types/invoice";

export default function ClientesPage() {
  const [customers, setCustomers] = useState<EnrichedCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerToDelete, setCustomerToDelete] = useState<EnrichedCustomer | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getCustomers();
      setCustomers(result.data);
    } catch {
      toast.error("Error al cargar clientes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = React.useCallback(
    async (term: string) => {
      try {
        setIsLoading(true);
        if (term.trim() === "") {
          await fetchCustomers();
        } else {
          const { searchCustomers } = await import("./api");
          const result = await searchCustomers(term);
          setCustomers(result);
        }
      } catch {
        toast.error("Error al buscar clientes");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCustomers]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomer(customerToDelete.id);
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      toast.success("Cliente eliminado correctamente");
      setCustomerToDelete(null);
    } catch {
      toast.error("Error al eliminar el cliente");
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Clientes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Contactos simples para ventas y seguimiento.
            </p>
          </div>
          <Button
            asChild
            className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/clientes/agregar-clientes">
              <Plus className="h-4 w-4" />
              Nuevo cliente
            </Link>
          </Button>
        </div>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 rounded-xl border-border bg-card pl-10"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                    No hay clientes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {customer.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        ) : null}
                        {customer.email ? <div>{customer.email}</div> : null}
                      </div>
                    </TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/clientes/editar-clientes?id=${customer.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCustomerToDelete(customer)}
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

      <Dialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar cliente?</DialogTitle>
            <DialogDescription>
              Estas por eliminar a &quot;{customerToDelete?.name}&quot;. Esta accion no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
