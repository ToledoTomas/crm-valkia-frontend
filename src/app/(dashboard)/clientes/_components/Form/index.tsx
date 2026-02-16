import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "../../api";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Save, CheckCircle } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createCustomer({ name: formData.fullname, email: formData.email, phone: formData.phone });
      setFormData({
        fullname: "",
        email: "",
        phone: "",
      });
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error al crear el cliente"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setTimeout(() => {
      router.push("/clientes");
      router.refresh();
    }, 100);
  };

  return (
    <>
      <Card className="w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullname">Nombre Completo</Label>
              <Input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="cliente@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ingrese el teléfono"
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
                  <Save className="mr-2 h-4 w-4" /> Guardar Cliente
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
              El cliente ha sido creado exitosamente.
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