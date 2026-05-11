"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createProduct } from "../../api";
import { CreateProductVariantDto } from "@/types/product";

interface VariantFormData extends CreateProductVariantDto {
  id?: number;
}

const emptyVariant: VariantFormData = {
  color: "",
  size: "",
  cost: 0,
  price: 0,
  stock: 0,
  minStock: 0,
};

export default function ProductForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    active: true,
  });
  const [variants, setVariants] = useState<VariantFormData[]>([]);
  const [newVariant, setNewVariant] = useState<VariantFormData>(emptyVariant);

  const toNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const toInteger = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleProductChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    if (!newVariant.color.trim() || !newVariant.size.trim()) {
      toast.error("Color y talle son obligatorios");
      return;
    }

    if (newVariant.stock < 0 || (newVariant.minStock ?? 0) < 0) {
      toast.error("El stock no puede ser negativo");
      return;
    }

    if (newVariant.price < 0) {
      toast.error("El precio no puede ser negativo");
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
    setNewVariant({ ...emptyVariant });
    toast.success("Variante agregada");
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
    toast.success("Variante eliminada");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error("El nombre y categoria son obligatorios");
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
      toast.success("Producto creado");
      router.push("/productos");
    } catch {
      toast.error("Error al crear el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
  };

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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Nuevo producto</h1>
            <p className="text-sm text-muted-foreground">Carga datos basicos y stock inicial.</p>
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
                  onChange={(e) => handleProductChange("name", e.target.value)}
                  placeholder="Ej: Remera basica"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleProductChange("category", e.target.value)}
                  placeholder="Ej: Remeras"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleProductChange("description", e.target.value)}
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
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={newVariant.stock || ""}
                  onChange={(e) => handleVariantChange("stock", toInteger(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock minimo</Label>
                <Input
                  type="number"
                  value={newVariant.minStock || ""}
                  onChange={(e) => handleVariantChange("minStock", toInteger(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Precio</Label>
                <Input
                  type="number"
                  value={newVariant.price || ""}
                  onChange={(e) => handleVariantChange("price", toNumber(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-5">
                <Button type="button" variant="outline" onClick={addVariant} className="w-full rounded-xl">
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
                  {variants.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{variant.stock}</TableCell>
                      <TableCell>{variant.minStock}</TableCell>
                      <TableCell>{formatCurrency(variant.price)}</TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}>
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
            <Button type="submit" disabled={isLoading} className="rounded-xl">
              {isLoading ? (
                "Guardando..."
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
