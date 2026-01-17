"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "../../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MultiSelect from "@/components/ui/multi-select";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    size: [] as string[],
    color: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        cost: Number(formData.cost),
        stock: Number(formData.stock),
        size: formData.size,
        color: formData.color,
      };

      await createProduct(productData);
      setFormData({
        name: "",
        size: [],
        description: "",
        price: "",
        cost: "",
        stock: "",
        color: [],
      });
      setTimeout(() => {
        setShowSuccess(true);
      }, 100);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al crear el producto",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    // Pequeño delay para permitir que el diálogo se cierre visualmente
    setTimeout(() => {
      router.push("/productos");
      router.refresh();
    }, 300);
  };

  return (
    <>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese el nombre del producto"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Costo</Label>
                <Input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingrese la descripción del producto"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <MultiSelect
                label="Talles"
                options={["XS", "S", "M", "L", "XL", "XXL"]}
                selected={formData.size}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, size: selected }))
                }
                placeholder="Seleccionar talles"
              />
            </div>

            <div className="space-y-2">
              <MultiSelect
                label="Colores"
                options={[
                  "Blanco",
                  "Negro",
                  "Rojo",
                  "Azul",
                  "Verde",
                  "Amarillo",
                  "Gris",
                ]}
                selected={formData.color}
                onChange={(selected) =>
                  setFormData((prev) => ({ ...prev, color: selected }))
                }
                placeholder="Seleccionar colores"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar Producto
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" /> Operación
              Exitosa
            </DialogTitle>
            <DialogDescription>
              El producto ha sido creado exitosamente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleSuccessClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Form;
