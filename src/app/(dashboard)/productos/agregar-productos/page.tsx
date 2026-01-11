"use client";

import React from "react";
import Form from "./../_components/Form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const pageAgregarProductos = () => {
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
          Agregar Nuevo Producto
        </h1>
        <p className="text-muted-foreground">
          Complete el formulario para registrar un nuevo producto.
        </p>
      </div>
      <Form />
    </div>
  );
};

export default pageAgregarProductos;
