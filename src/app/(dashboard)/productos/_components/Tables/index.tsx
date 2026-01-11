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
                    className="text-blue-600 hover:text-blue-900 transition-transform transform hover:scale-110 mr-3"
                    title="Editar producto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900 font-bold text-xl transition-transform transform hover:scale-110"
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
