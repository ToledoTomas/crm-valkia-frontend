"use client";

import React from "react";
import Form from "./../_components/Form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const pageAgregarOrdenes = () => {
  return (
    <div className="container max-w-4xl py-10 mx-auto">
      <div className="mb-6">
        <Link
          href="/ordenes"
          className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a ordenes
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Agregar Nueva Orden
        </h1>
        <p className="text-muted-foreground">
          Complete el formulario para crear una nueva orden.
        </p>
      </div>
      <Form />
    </div>
  );
};

export default pageAgregarOrdenes;
