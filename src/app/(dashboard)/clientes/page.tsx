"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, User, Phone, Instagram, Crown } from "lucide-react";
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

import { getCustomers, deleteCustomer } from "./api";
import { EnrichedCustomer, CustomerClassification } from "@/types/invoice";

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
    } catch (error) {
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
      } catch (error) {
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
    } catch (error) {
      toast.error("Error al eliminar el cliente");
    }
  };

  const getClassificationBadge = (classification: CustomerClassification) => {
    const variants: Record<CustomerClassification, { color: string; icon: React.ReactNode }> = {
      NUEVO: { color: "bg-blue-100 text-blue-800", icon: <User className="h-3 w-3" /> },
      RECURRENTE: { color: "bg-green-100 text-green-800", icon: <User className="h-3 w-3" /> },
      VIP: { color: "bg-yellow-100 text-yellow-800", icon: <Crown className="h-3 w-3" /> },
      INACTIVO: { color: "bg-gray-100 text-gray-800", icon: <User className="h-3 w-3" /> },
    };

    const { color, icon } = variants[classification];
    return (
      <Badge className={`${color} flex items-center gap-1`}>
        {icon}
        {classification}
      </Badge>
    );
  };

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
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-500">Gestiona tus clientes y sus compras</p>
        </div>
        <Link href="/clientes/agregar-clientes">
          <Button className="bg-[#e5e5d0] hover:bg-[#d8d8b9] text-black">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Clasificación</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No hay clientes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.instagram && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Instagram className="h-3 w-3" />
                            @{customer.instagram}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getClassificationBadge(customer.classification)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell>
                      {customer.lastPurchase
                        ? new Date(customer.lastPurchase).toLocaleDateString("es-AR")
                        : "-"}
                    </TableCell>
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
            <DialogTitle>¿Eliminar cliente?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar a &quot;{customerToDelete?.name}&quot;. Esta acción no se puede deshacer.
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
