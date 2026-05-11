"use client";

import Form from "./../_components/Form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const pageAgregarClientes = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <Link href="/clientes" aria-label="Volver a clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Nuevo cliente
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Carga los datos basicos de contacto.
            </p>
          </div>
        </div>
      </header>
      <Form />
    </div>
  );
};

export default pageAgregarClientes;
