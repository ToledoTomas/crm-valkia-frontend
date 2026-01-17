import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { updateStatusOrder } from "../../api";

export interface Order {
  id: number;
  customer: {
    fullname: string;
  };
  products: {
    name: string;
  }[];
  created_at: string;
  total: number;
  status: string;
}

interface TablesProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  refresh: () => void;
}

export default function Tables({
  orders,
  isLoading,
  error,
  onDelete,
  refresh,
}: TablesProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdating(true);
      await updateStatusOrder(selectedOrder.id, newStatus);
      refresh();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating status:", error);
      // alert("Error al actualizar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="relative w-full overflow-auto rounded-md border bg-card">
        {error && (
          <div className="text-center py-4 text-destructive">{error}</div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No hay ordenes disponibles
          </div>
        )}

        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((item: Order) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    {item.customer?.fullname || "Cliente desconocido"}
                  </TableCell>
                  <TableCell>
                    {item.products && item.products.length > 0 ? (
                      item.products.map((p) => p.name).join(", ")
                    ) : (
                      <span className="text-muted-foreground italic">
                        Sin productos
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${item.total}</TableCell>
                  <TableCell>
                    {(() => {
                      let displayStatus = item.status;
                      try {
                        const parsed = JSON.parse(item.status);
                        if (
                          parsed &&
                          typeof parsed === "object" &&
                          parsed.status
                        ) {
                          displayStatus = parsed.status;
                        }
                      } catch (e: unknown) {
                        if (e instanceof Error) {
                          console.error("Error parsing JSON:", e.message);
                        } else {
                          console.error("Error parsing JSON:", e);
                        }
                      }

                      return (
                        <Badge
                          className={
                            displayStatus === "Pagado"
                              ? "bg-green-500 hover:bg-green-600 text-white border-transparent"
                              : displayStatus === "Cancelado"
                              ? "bg-red-500 hover:bg-red-600 text-white border-transparent"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white border-transparent"
                          }
                        >
                          {displayStatus}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:scale-110 transition-all duration-200 cursor-pointer"
                        onClick={() => openEditModal(item)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar estado</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive-50 hover:scale-110 transition-all duration-200 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="text-sm text-muted-foreground">Cargando...</div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Editar Estado de Orden #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <div className="col-span-3">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Pagado">Pagado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la orden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
