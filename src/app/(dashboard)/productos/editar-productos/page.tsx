"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  addVariant,
  deleteVariant,
  getProductById,
  updateProduct,
  updateVariant,
} from "../api";
import { EnrichedProduct, EnrichedVariant } from "@/types/product";

const emptyVariant = {
  color: "",
  size: "",
  cost: 0,
  price: 0,
  stock: 0,
  minStock: 0,
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toInteger = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function PageEditarProducto() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<EnrichedProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    active: true,
  });
  const [variants, setVariants] = useState<EnrichedVariant[]>([]);
  const [newVariant, setNewVariant] = useState({ ...emptyVariant });

  useEffect(() => {
    if (!id) {
      toast.error("No se proporciono un ID de producto valido");
      setLoading(false);
      return;
    }

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
      } catch {
        toast.error("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    loadProduct(parseInt(id, 10));
  }, [id]);

  const handleProductChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const addNewVariant = async () => {
    if (!id) return;

    if (!newVariant.color.trim() || !newVariant.size.trim()) {
      toast.error("Color y talle son obligatorios");
      return;
    }

    if (newVariant.stock < 0 || newVariant.minStock < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (newVariant.price < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    const duplicate = variants.find(
      (variant) => variant.color === newVariant.color && variant.size === newVariant.size
    );
    if (duplicate) {
      toast.error("Ya existe una variante con este color y talle");
      return;
    }

    try {
      const added = await addVariant(parseInt(id, 10), {
        color: newVariant.color,
        size: newVariant.size,
        cost: 0,
        price: newVariant.price,
        stock: newVariant.stock,
        minStock: newVariant.minStock,
      });
      setVariants((prev) => [...prev, added]);
      setNewVariant({ ...emptyVariant });
      toast.success("Variante agregada");
    } catch {
      toast.error("Error al agregar la variante");
    }
  };

  const updateExistingVariant = async (variantId: number, field: string, value: number) => {
    try {
      const updated = await updateVariant(variantId, { [field]: value });
      setVariants((prev) => prev.map((variant) => (variant.id === variantId ? updated : variant)));
    } catch {
      toast.error("Error al actualizar la variante");
    }
  };

  const removeVariant = async (variantId: number) => {
    if (!window.confirm("Eliminar esta variante?")) return;

    try {
      await deleteVariant(variantId);
      setVariants((prev) => prev.filter((variant) => variant.id !== variantId));
      toast.success("Variante eliminada");
    } catch {
      toast.error("Error al eliminar la variante");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!id) return;

    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error("El nombre y categoria son obligatorios");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(parseInt(id, 10), formData);
      toast.success("Producto actualizado");
    } catch {
      toast.error("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex h-96 max-w-5xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-muted-foreground">Producto no encontrado</p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/productos">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <Link href="/productos" aria-label="Volver a productos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Editar producto</h1>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Datos del producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) => handleProductChange("name", event.target.value)}
                  placeholder="Ej: Remera basica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(event) => handleProductChange("category", event.target.value)}
                  placeholder="Ej: Remeras"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(event) => handleProductChange("description", event.target.value)}
                placeholder="Descripcion breve del producto"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleProductChange("active", checked)}
              />
              <Label htmlFor="active">Producto activo</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Variantes y stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-muted/20 p-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label>Color *</Label>
                <Input
                  value={newVariant.color}
                  onChange={(event) => handleVariantChange("color", event.target.value)}
                  placeholder="Ej: Blanco"
                />
              </div>
              <div className="space-y-2">
                <Label>Talle *</Label>
                <Input
                  value={newVariant.size}
                  onChange={(event) => handleVariantChange("size", event.target.value)}
                  placeholder="Ej: M"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={newVariant.stock || ""}
                  onChange={(event) => handleVariantChange("stock", toInteger(event.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock minimo</Label>
                <Input
                  type="number"
                  value={newVariant.minStock || ""}
                  onChange={(event) => handleVariantChange("minStock", toInteger(event.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Precio</Label>
                <Input
                  type="number"
                  value={newVariant.price || ""}
                  onChange={(event) => handleVariantChange("price", toNumber(event.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-5">
                <Button type="button" variant="outline" onClick={addNewVariant} className="w-full rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar variante
                </Button>
              </div>
            </div>

            {variants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Color</TableHead>
                    <TableHead>Talle</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Minimo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(event) =>
                            updateExistingVariant(variant.id, "stock", toInteger(event.target.value))
                          }
                          className="h-9 w-24 rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.minStock}
                          onChange={(event) =>
                            updateExistingVariant(variant.id, "minStock", toInteger(event.target.value))
                          }
                          className="h-9 w-24 rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(event) =>
                            updateExistingVariant(variant.id, "price", toNumber(event.target.value))
                          }
                          className="h-9 w-24 rounded-lg"
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
              <div className="py-8 text-center text-muted-foreground">
                No hay variantes. Agrega al menos una para continuar.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/productos">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="rounded-xl">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar producto
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
