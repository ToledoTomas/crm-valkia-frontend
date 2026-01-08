import React from "react";
// import { getProducts, deleteProductId } from "../../api/index.js"; // logic moved to page

export interface Product {
  id: number;
  name: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  size: string[];
  color: string[];
}

interface TablesProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

export default function Tables({
  products,
  isLoading,
  error,
  onDelete,
}: TablesProps) {
  const classTh =
    "px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ";

  return (
    <div className="overflow-x-auto relative">
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-4">No hay productos disponibles</div>
      )}
      <div
        className={`transition-opacity duration-200 ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
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
                    onClick={() => onDelete(item.id)}
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 p-2 rounded shadow">Cargando...</div>
        </div>
      )}
    </div>
  );
}
