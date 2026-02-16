"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ChevronDown, ChevronUp, Edit2, Trash2, Search as SearchIcon } from "lucide-react";
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

import { getProducts, searchProducts, deleteProduct } from "./api";
import { EnrichedProduct, EnrichedVariant } from "@/types/product";

export default function ProductosPage() {
  const [products, setProducts] = useState<EnrichedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<EnrichedProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getProducts();
      setProducts(result.data);
    } catch (error) {
      toast.error("Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = React.useCallback(
    async (term: string) => {
      try {
        setIsLoading(true);
        if (term.trim() === "") {
          await fetchProducts();
        } else {
          const result = await searchProducts(term);
          setProducts(result);
        }
      } catch (error) {
        toast.error("Error al buscar productos");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProducts]
  );

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast.success("Producto eliminado correctamente");
      setProductToDelete(null);
    } catch (error) {
      toast.error("Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

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
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-gray-500">Gestiona tu catálogo de productos y variantes</p>
        </div>
        <Link href="/productos/agregar-productos">
          <Button className="bg-[#e5e5d0] hover:bg-[#d8d8b9] text-black">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
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
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock Total</TableHead>
                <TableHead>Variantes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No hay productos. Crea tu primer producto para comenzar.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow className="cursor-pointer hover:bg-gray-50">
                      <TableCell
                        onClick={() =>
                          setExpandedProduct(expandedProduct === product.id ? null : product.id)
                        }
                        className="font-medium"
                      >
                        <div className="flex items-center gap-2">
                          {expandedProduct === product.id ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <span
                          className={
                            product.totalStock === 0
                              ? "text-red-600 font-medium"
                              : product.totalStock < 10
                              ? "text-yellow-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          {product.totalStock}
                        </span>
                      </TableCell>
                      <TableCell>{product.variants?.length || 0}</TableCell>
                      <TableCell>
                        <Badge variant={product.active ? "default" : "secondary"}>
                          {product.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/productos/editar-productos?id=${product.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setProductToDelete(product)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedProduct === product.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50">
                          <div className="py-2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Color</TableHead>
                                  <TableHead>Talle</TableHead>
                                  <TableHead>Costo</TableHead>
                                  <TableHead>Precio</TableHead>
                                  <TableHead>Ganancia</TableHead>
                                  <TableHead>Margen</TableHead>
                                  <TableHead>Stock</TableHead>
                                  <TableHead>Mínimo</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.variants?.map((variant: EnrichedVariant) => (
                                  <TableRow key={variant.id}>
                                    <TableCell>
                                      <Badge variant="outline">{variant.color}</Badge>
                                    </TableCell>
                                    <TableCell>{variant.size}</TableCell>
                                    <TableCell>{formatCurrency(variant.cost)}</TableCell>
                                    <TableCell>{formatCurrency(variant.price)}</TableCell>
                                    <TableCell className="text-green-600">
                                      {formatCurrency(variant.ganancia)}
                                    </TableCell>
                                    <TableCell className="text-green-600">
                                      {variant.margen}%
                                    </TableCell>
                                    <TableCell>
                                      <span
                                        className={
                                          variant.stock <= variant.minStock
                                            ? "text-red-600 font-medium"
                                            : "text-green-600 font-medium"
                                        }
                                      >
                                        {variant.stock}
                                      </span>
                                    </TableCell>
                                    <TableCell>{variant.minStock}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar &quot;{productToDelete?.name}&quot;. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
