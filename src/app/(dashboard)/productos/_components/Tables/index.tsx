import React, { useEffect, useState } from "react";
import { getProducts, deleteProductId } from "../../api/index.js";

interface Product {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  size: string[];
  color: string[];
}

export default function Tables() {
  const classTh =
    "px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getProducts();
      setProducts(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProductId(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error al eliminar el producto");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <div className="text-center py-4">Cargando productos...</div>
      )}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-4">No hay productos disponibles</div>
      )}
      <table className="min-w-full">
        <thead>
          <tr>
            <th className={classTh}>ID</th>
            <th className={classTh}>Nombre</th>
            <th className={classTh}>Descripción</th>
            <th className={classTh}>Costo</th>
            <th className={classTh}>Precio</th>
            <th className={classTh}>Stock</th>
            <th className={classTh}>Tamaño</th>
            <th className={classTh}>Color</th>
            <th className={classTh}>Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((item: Product) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="px-5 py-4">{item.id}</td>
              <td className="px-5 py-4">{item.name}</td>
              <td className="px-5 py-4">{item.description}</td>
              <td className="px-5 py-4">$ {item.cost}</td>
              <td className="px-5 py-4">$ {item.price}</td>
              <td className="px-5 py-4">{item.stock}</td>
              <td className="px-5 py-4">{item.size.join(", ")}</td>
              <td className="px-5 py-4">{item.color.join(", ")}</td>
              <td className="px-5 py-4">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-900 font-bold text-xl"
                  title="Eliminar producto"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
