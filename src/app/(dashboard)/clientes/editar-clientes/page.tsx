"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClientById, updateClient } from "../api";
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

const PageEditarCliente = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (id) {
      loadClient(id);
    } else {
      setError("No se proporcionó un ID de cliente válido.");
      setLoading(false);
    }
  }, [id]);

  const loadClient = async (clientId: string) => {
    try {
      setLoading(true);
      const data = await getClientById(clientId);
      if (data) {
        setFormData({
          fullname: data.fullname || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        (err as Error).message || "Error al cargar los datos del cliente."
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
      await updateClient(id, formData);
      router.push("/clientes"); // Redirect back to list
      router.refresh(); // Refresh data
    } catch (err) {
      console.error(err);
      setError("Error al actualizar el cliente.");
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
        <Link href="/clientes">
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
          href="/clientes"
          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a clientes
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Editar Cliente
        </h1>
        <p className="text-muted-foreground">
          Actualiza la información del cliente.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nombre Completo</Label>
              <Input
                id="fullname"
                name="fullname"
                placeholder="Juan Perez"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+54 9 11 ..."
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/clientes">
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

export default PageEditarCliente;
