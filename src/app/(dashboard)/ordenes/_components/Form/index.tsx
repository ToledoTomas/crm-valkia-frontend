import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "../../api";
import { getProducts } from "../../../productos/api";
import { getClients } from "../../../clientes/api";
import { Product } from "../../../productos/_components/Tables";
import { Customer } from "../../../clientes/_components/Tables";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Save, Trash2, Plus } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    products: [] as Product[],
    date: "",
    status: "Pendiente",
    total: 0,
  });

  const [clients, setClients] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, clientsData] = await Promise.all([
          getProducts(),
          getClients(),
        ]);
        setProducts(productsData);
        setClients(clientsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar productos o clientes");
      }
    };
    fetchData();
  }, []);

  const handleClientChange = (value: string) => {
    const client = clients.find((c) => c.id === Number(value));
    setFormData((prev) => ({
      ...prev,
      clientId: value,
      clientName: client ? client.fullname : "",
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === Number(selectedProduct));

    if (product) {
      if (product.stock <= 0) {
        alert("El producto no tiene stock disponible");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        products: [...prev.products, product],
        total: prev.total + product.price,
      }));
      setSelectedProduct("");
    }
  };

  const handleRemoveProduct = (index: number) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      const removed = newProducts.splice(index, 1)[0];
      return {
        ...prev,
        products: newProducts,
        total: prev.total - removed.price,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.products.length === 0) {
      setError("Debe agregar al menos un producto a la orden");
      setLoading(false);
      return;
    }

    if (!formData.clientId) {
      setError("Debe seleccionar un cliente");
      setLoading(false);
      return;
    }

    if (!formData.date) {
      setError("Debe seleccionar una fecha");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        id: Math.floor(Math.random() * 1000000), // Auto-generated ID
        customer: Number(formData.clientId),
        created_at: new Date(formData.date).toISOString(),
        total: formData.total,
        products: formData.products.map((p) => p.id),
        status: formData.status,
      };

      await createOrder(orderData);
      setFormData({
        clientId: "",
        clientName: "",
        products: [],
        date: "",
        status: "Pendiente",
        total: 0,
      });
      alert("Orden creada exitosamente");
      router.push("/ordenes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Detalles de la Orden</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Cliente</Label>
              <Select
                value={formData.clientId}
                onValueChange={handleClientChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Agregar Productos</Label>
            <div className="flex gap-2">
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={String(product.id)}
                      disabled={product.stock <= 0}
                    >
                      {product.name} - ${product.price}{" "}
                      {product.stock <= 0 ? "(Sin Stock)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddProduct}
                disabled={!selectedProduct}
              >
                <Plus className="mr-2 h-4 w-4" /> Agregar
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-muted-foreground h-24"
                    >
                      No hay productos agregados
                    </TableCell>
                  </TableRow>
                ) : (
                  formData.products.map((p, index) => (
                    <TableRow key={`${p.id}-${index}`}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell className="text-right">${p.price}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="p-4 bg-muted/50 flex justify-end items-center gap-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${formData.total}</span>
            </div>
          </div>

          <div className="space-y-2 w-full md:w-1/3">
            <Label htmlFor="status">Estado</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Estado de la orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
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
                <Save className="mr-2 h-4 w-4" /> Guardar Orden
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Form;
