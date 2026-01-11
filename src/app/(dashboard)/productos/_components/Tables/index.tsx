import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
// import { getProducts, deleteProductId } from "../../api/index.js"; // logic moved to page

export interface Product {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  size: string[];
  color: string[];
}

interface TablesProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Tables({
  products,
  isLoading,
  error,
  onDelete,
}: TablesProps) {
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

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No hay productos disponibles
          </div>
        )}

        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item: Product) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={item.description}
                  >
                    {item.description}
                  </TableCell>
                  <TableCell>$ {item.cost}</TableCell>
                  <TableCell>$ {item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.size.map((s, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-[10px] px-1 py-0"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.color.map((c, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] px-1 py-0"
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/productos/editar-productos?id=${item.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              al producto.
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
