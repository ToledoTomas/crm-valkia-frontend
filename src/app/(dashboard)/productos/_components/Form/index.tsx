"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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

import { createProduct } from "../../api";
import { CreateProductVariantDto } from "@/types/product";
import Link from "next/link";

interface VariantFormData extends CreateProductVariantDto {
  id?: number;
}

export default function ProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Datos del producto
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    active: true,
  });

  // Variantes
  const [variants, setVariants] = useState<VariantFormData[]>([]);
  const [newVariant, setNewVariant] = useState<VariantFormData>({
    color: "",
    size: "",
    cost: 0,
    price: 0,
    stock: 0,
    minStock: 0,
  });

  const handleProductChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const calculateProfit = (price: number, cost: number) => {
    return price - cost;
  };

  const calculateMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return Math.round(((price - cost) / price) * 100);
  };

  const addVariant = () => {
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

    setVariants([...variants, { ...newVariant }]);
    setNewVariant({
      color: "",
      size: "",
      cost: 0,
      price: 0,
      stock: 0,
      minStock: 0,
    });
    toast.success("Variante agregada");
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    toast.success("Variante eliminada");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error("El nombre y categoría son obligatorios");
      return;
    }

    if (variants.length === 0) {
      toast.error("Debes agregar al menos una variante");
      return;
    }

    setIsLoading(true);

    try {
      await createProduct({
        ...formData,
        variants,
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error("Error al crear el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/productos">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nuevo Producto</h1>
          <p className="text-gray-500">Crea un producto con sus variantes</p>
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
                  placeholder="Ej: Remera Básica"
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
                  placeholder="Ej: Ropa, Accesorios"
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
                placeholder="Descripción del producto..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label>Color *</Label>
                <Input
                  value={newVariant.color}
                  onChange={(e) =>
                    handleVariantChange("color", e.target.value)
                  }
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
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="0"
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
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Variante
                </Button>
              </div>
            </div>

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
                  {variants.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{variant.color}</Badge>
                      </TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{formatCurrency(variant.cost)}</TableCell>
                      <TableCell>{formatCurrency(variant.price)}</TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(
                          calculateProfit(variant.price, variant.cost)
                        )}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {calculateMargin(variant.price, variant.cost)}%
                      </TableCell>
                      <TableCell>{variant.stock}</TableCell>
                      <TableCell>{variant.minStock}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(index)}
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
            >
              {isLoading ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Producto
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
              Producto Creado
            </DialogTitle>
            <DialogDescription>
              El producto y sus variantes han sido creados exitosamente.
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
