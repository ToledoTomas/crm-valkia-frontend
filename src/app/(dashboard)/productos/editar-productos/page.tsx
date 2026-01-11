"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductById, updateProduct } from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

const PageEditarProducto = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: 0,
    price: 0,
    stock: 0,
    size: "", // handled as string for input
    color: "", // handled as string for input
  });

  useEffect(() => {
    if (id) {
      loadProduct(id);
    } else {
      setError("No se proporcionó un ID de producto válido.");
      setLoading(false);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          cost: data.cost || 0,
          price: data.price || 0,
          stock: data.stock || 0,
          size: data.size ? data.size.join(", ") : "",
          color: data.color ? data.color.join(", ") : "",
        });
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del producto."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      // Process Size and Color back to arrays
      const payload = {
        ...formData,
        cost: Number(formData.cost),
        price: Number(formData.price),
        stock: Number(formData.stock),
        size: formData.size
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        color: formData.color
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      await updateProduct(id, payload);
      router.push("/productos"); // Redirect back to list
      router.refresh(); // Refresh data
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al actualizar el producto."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-card flex-col items-center justify-center h-screen gap-4">
        <p className="text-destructive font-medium">{error}</p>
        <Link href="/productos">
          <Button variant="outline">
            {" "}
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver{" "}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10 mx-auto">
      <div className="mb-6">
        <Link
          href="/productos"
          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a productos
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Editar Producto
        </h1>
        <p className="text-muted-foreground">
          Actualiza la información del producto.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Costo</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Tamaños (separados por coma)</Label>
              <Input
                id="size"
                name="size"
                placeholder="S, M, L, XL"
                value={formData.size}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Colores (separados por coma)</Label>
              <Input
                id="color"
                name="color"
                placeholder="Rojo, Azul, Negro"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/productos">
              <Button variant="ghost" type="button">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PageEditarProducto;
