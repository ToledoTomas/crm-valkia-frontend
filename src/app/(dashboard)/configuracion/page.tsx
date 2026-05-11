"use client";

import { useRouter } from "next/navigation";
import { Building2, LogOut, Mail, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ConfiguracionPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Configuracion
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuenta y sesion actual.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground">Administrador</p>
                <p className="text-sm text-muted-foreground">Acceso principal</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>admin@valkia.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Valkia CRM</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Rol administrador</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LogOut className="h-4 w-4" />
              Sesion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cierra la sesion actual cuando termines de trabajar.
            </p>
            <Button
              variant="destructive"
              className="w-full rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesion
            </Button>
          </CardContent>
        </Card>
      </div>

      <p className="px-1 text-xs text-muted-foreground">Version 1.0.0</p>
    </div>
  );
}
