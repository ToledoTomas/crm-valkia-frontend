"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Building2 } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-gray-500">Ajustes de la cuenta y del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la Cuenta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-[#e5e5d0] flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Administrador</p>
                <p className="text-sm text-gray-500">Rol: Admin</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">admin@valkia.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Valkia CRM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sesión */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              Cierra tu sesión actual para salir del sistema de forma segura.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>

        {/* Acerca de */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Acerca de Valkia CRM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Versión</p>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <p className="text-gray-500">Última actualización</p>
                <p className="font-medium">Febrero 2026</p>
              </div>
            </div>
            <Separator />
            <p className="text-sm text-gray-500">
              Sistema de gestión de ventas y productos diseñado para pequeños
              negocios de indumentaria. Gestiona tu inventario, controla tus
              ventas y analiza la rentabilidad de tu negocio.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
