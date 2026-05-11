"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createInvoice } from "../api";
import { searchCustomers } from "../../clientes/api";
import { searchProducts } from "../../productos/api";
import { EnrichedCustomer } from "@/types/invoice";
import { EnrichedProduct, EnrichedVariant } from "@/types/product";

interface CartItem {
  id: number;
  productVariantId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  cost: number;
  availableStock: number;
}

export default function NuevaVentaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Cliente
  const [selectedCustomer, setSelectedCustomer] = useState<EnrichedCustomer | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState<EnrichedCustomer[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);

  // Productos
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<EnrichedProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<EnrichedProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<EnrichedVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Carrito
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Buscar clientes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (customerSearch.trim().length > 2) {
        try {
          const results = await searchCustomers(customerSearch);
          setCustomerResults(results);
        } catch (error) {
          console.error("Error searching customers:", error);
        }
      } else {
        setCustomerResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerSearch]);

  // Buscar productos
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (productSearch.trim().length > 2) {
        try {
          const results = await searchProducts(productSearch);
          setProductResults(results);
        } catch (error) {
          console.error("Error searching products:", error);
        }
      } else {
        setProductResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [productSearch]);

  const addToCart = () => {
    if (!selectedProduct || !selectedVariant) {
      toast.error("Selecciona un producto y variante");
      return;
    }

    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Stock insuficiente. Disponible: ${selectedVariant.stock}`);
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.productVariantId === selectedVariant.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > selectedVariant.stock) {
        toast.error(`Stock insuficiente. Disponible: ${selectedVariant.stock}`);
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.productVariantId === selectedVariant.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: Date.now(),
          productVariantId: selectedVariant.id,
          productName: selectedProduct.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          quantity,
          price: selectedVariant.price,
          cost: selectedVariant.cost,
          availableStock: selectedVariant.stock,
        },
      ]);
    }

    toast.success("Producto agregado al carrito");
    setSelectedProduct(null);
    setSelectedVariant(null);
    setQuantity(1);
    setProductSearch("");
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    if (cartItems.length === 0) {
      toast.error("Agrega al menos un producto al carrito");
      return;
    }

    setIsLoading(true);

    try {
      await createInvoice({
        customerId: selectedCustomer?.id,
        items: cartItems.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });
      toast.success("Venta registrada");
      router.push("/ventas");
    } catch {
      toast.error("Error al crear la venta");
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm md:px-5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl">
            <Link href="/ventas" aria-label="Volver a ventas">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Nueva venta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecciona productos, cantidades y confirma el total.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel izquierdo: Cliente y Productos */}
        <div className="space-y-6">
          {/* Selección de Cliente */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5" />
                Cliente (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between"
                  >
                    {selectedCustomer
                      ? selectedCustomer.name
                      : "Buscar cliente..."}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar cliente..."
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                      <CommandGroup>
                        {customerResults.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={() => {
                              setSelectedCustomer(customer);
                              setCustomerOpen(false);
                            }}
                          >
                            {customer.name}
                            {customer.phone && (
                              <span className="ml-2 text-gray-400 text-sm">
                                ({customer.phone})
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedCustomer && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      {selectedCustomer.phone && (
                        <p className="text-sm text-gray-500">
                          {selectedCustomer.phone}
                        </p>
                      )}
                      <Badge className="mt-2" variant="secondary">
                        {selectedCustomer.classification}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agregar Productos */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5" />
                Agregar Productos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Buscar producto..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />

              {productResults.length > 0 && !selectedProduct && (
                <div className="border rounded-lg max-h-48 overflow-auto">
                  {productResults.map((product) => (
                    <button
                      key={product.id}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                      onClick={() => {
                        setSelectedProduct(product);
                        setProductResults([]);
                      }}
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.category} • {product.variants?.length || 0}{" "}
                        variantes
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {selectedProduct && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{selectedProduct.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedProduct.category}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(null);
                        setSelectedVariant(null);
                      }}
                    >
                      Cambiar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Variante (Color / Talle)
                      </label>
                      <select
                        className="w-full mt-1 p-2 border rounded-md"
                        value={selectedVariant?.id || ""}
                        onChange={(e) => {
                          const variant = selectedProduct.variants?.find(
                            (v) => v.id === parseInt(e.target.value)
                          );
                          setSelectedVariant(variant || null);
                        }}
                      >
                        <option value="">Seleccionar...</option>
                        {selectedProduct.variants?.map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.color} / {variant.size} (Stock: {variant.stock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Cantidad</label>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {selectedVariant && (
                    <div className="text-sm text-muted-foreground">
                      Precio: {formatCurrency(selectedVariant.price)}
                    </div>
                  )}

                  <Button
                    className="w-full bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
                    onClick={addToCart}
                    disabled={!selectedVariant}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel derecho: Carrito y Resumen */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingCart className="h-5 w-5" />
                Carrito
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  El carrito está vacío. Agrega productos para continuar.
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">
                              {item.color} / {item.size}
                            </p>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-[#e5e5d0] text-black hover:bg-[#d8d8b9]"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Procesando..." : "Confirmar Venta"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
