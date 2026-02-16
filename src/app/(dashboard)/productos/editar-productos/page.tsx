"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getProductById,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
} from "../api";
import { EnrichedProduct, EnrichedVariant } from "@/types/product";

export default function PageEditarProducto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [product, setProduct] = useState<EnrichedProduct | null>(null);

  // Datos del producto
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    active: true,
  });

  // Variantes
  const [variants, setVariants] = useState<EnrichedVariant[]>([]);
  const [newVariant, setNewVariant] = useState({
    color: "",
    size: "",
    cost: 0,
    price: 0,
    stock: 0,
    minStock: 0,
  });

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    } else {
      toast.error("No se proporcionó un ID de producto válido");
      setLoading(false);
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
      setFormData({
        name: data.name,
        category: data.category,
        description: data.description || "",
        active: data.active,
      });
      setVariants(data.variants || []);
    } catch (error) {
      toast.error("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const calculateProfit = (price: number, cost: number) => price - cost;
  const calculateMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const addNewVariant = async () => {
    if (!id) return;
    if (!newVariant.color || !newVariant.size) {
      toast.error("El color y talle son obligatorios");
      return;
    }
    if (newVariant.price <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    const duplicate = variants.find(
      (v) => v.color === newVariant.color && v.size === newVariant.size
    );
    if (duplicate) {
      toast.error("Ya existe una variante con este color y talle");
      return;
    }

    try {
      const added = await addVariant(parseInt(id), {
        color: newVariant.color,
        size: newVariant.size,
        cost: newVariant.cost,
        price: newVariant.price,
        stock: newVariant.stock,
        minStock: newVariant.minStock,
      });
      setVariants([...variants, added]);
      setNewVariant({
        color: "",
        size: "",
        cost: 0,
        price: 0,
        stock: 0,
        minStock: 0,
      });
      toast.success("Variante agregada");
    } catch (error) {
      toast.error("Error al agregar la variante");
    }
  };

  const updateExistingVariant = async (
    variantId: number,
    field: string,
    value: number
  ) => {
    try {
      const updated = await updateVariant(variantId, { [field]: value });
      setVariants(variants.map((v) => (v.id === variantId ? updated : v)));
    } catch (error) {
      toast.error("Error al actualizar la variante");
    }
  };

  const removeVariant = async (variantId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta variante?")) return;
    
    try {
      await deleteVariant(variantId);
      setVariants(variants.filter((v) => v.id !== variantId));
      toast.success("Variante eliminada");
    } catch (error) {
      toast.error("Error al eliminar la variante");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!formData.name || !formData.category) {
      toast.error("El nombre y categoría son obligatorios");
      return;
    }

    setSaving(true);

    try {
      await updateProduct(parseInt(id), formData);
      setShowSuccess(true);
    } catch (error) {
      toast.error("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-red-600">Producto no encontrado</p>
        <Link href="/productos">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/productos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <p className="text-gray-500">{product.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Producto */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleProductChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleProductChange("category", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleProductChange("description", e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  handleProductChange("active", checked)
                }
              />
              <Label htmlFor="active">Producto activo</Label>
            </div>
          </CardContent>
        </Card>

        {/* Variantes */}
        <Card>
          <CardHeader>
            <CardTitle>Variantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Agregar nueva variante */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label>Color *</Label>
                <Input
                  value={newVariant.color}
                  onChange={(e) => handleVariantChange("color", e.target.value)}
                  placeholder="Ej: Blanco"
                />
              </div>
              <div className="space-y-2">
                <Label>Talle *</Label>
                <Input
                  value={newVariant.size}
                  onChange={(e) => handleVariantChange("size", e.target.value)}
                  placeholder="Ej: M"
                />
              </div>
              <div className="space-y-2">
                <Label>Costo</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newVariant.cost || ""}
                  onChange={(e) =>
                    handleVariantChange("cost", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Precio *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newVariant.price || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVariant.stock || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      "stock",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Mínimo</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVariant.minStock || ""}
                  onChange={(e) =>
                    handleVariantChange(
                      "minStock",
                      parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewVariant}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Variante
                </Button>
              </div>
            </div>

            {/* Tabla de variantes existentes */}
            {variants.length > 0 ? (
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
                    <TableHead>Mín</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <Badge variant="outline">{variant.color}</Badge>
                      </TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.cost}
                          onChange={(e) =>
                            updateExistingVariant(
                              variant.id,
                              "cost",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) =>
                            updateExistingVariant(
                              variant.id,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(
                          calculateProfit(variant.price, variant.cost)
                        )}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {calculateMargin(variant.price, variant.cost)}%
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateExistingVariant(
                              variant.id,
                              "stock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={variant.minStock}
                          onChange={(e) =>
                            updateExistingVariant(
                              variant.id,
                              "minStock",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(variant.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay variantes.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/productos">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
            >
              {saving ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Cambios Guardados
            </DialogTitle>
            <DialogDescription>
              El producto ha sido actualizado exitosamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => router.push("/productos")}
              className="bg-green-600 hover:bg-green-700"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
