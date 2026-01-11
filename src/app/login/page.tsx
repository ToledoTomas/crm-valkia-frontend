"use client";

import { useState } from "react";
import { login } from "./api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Login = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(user);
      const token =
        res.token || res.accessToken || res.access_token || res["access-token"];
      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.error("No token found in response");
      }
      router.push("/productos");
    } catch (err: unknown) {
      console.error("Error logging in:", err);
      setError(
        "Error al iniciar sesión. Por favor verifique sus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fbfbf2]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Inicio de Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#e5e5d0] text-black hover:bg-[#d8d8b9] cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {loading ? "Cargando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
