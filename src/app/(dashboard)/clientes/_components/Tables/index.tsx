import React from "react";

export interface Customer {
  id: number;
  fullname: string;
  email: string;
  phone: string;
}

interface TablesProps {
  clients: Customer[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

export default function Tables({
  clients,
  isLoading,
  error,
  onDelete,
}: TablesProps) {
  const classTh =
    "px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ";

  return (
    <div className="overflow-x-auto relative">
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!isLoading && !error && clients.length === 0 && (
        <div className="text-center py-4">No hay clientes disponibles</div>
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
              <th className={classTh}>Nombre completo</th>
              <th className={classTh}>Email</th>
              <th className={classTh}>Telefono</th>
              <th className={classTh}>Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((item: Customer) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="px-5 py-4">{item.id}</td>
                <td className="px-5 py-4">{item.fullname}</td>
                <td className="px-5 py-4">{item.email}</td>
                <td className="px-5 py-4">{item.phone}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900 font-bold text-xl"
                    title="Eliminar cliente"
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
