import React, { useEffect, useState } from "react";
import { getClients, deleteClientId } from "../../api/index.js";

interface Customer {
  id: number;
  fullname: string;
  email: string;
  phone: string;
}

export default function Tables() {
  const classTh =
    "px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase ";

  const [clients, setClients] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getClients();
      setClients(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteClientId(id);
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
      alert("Error al eliminar el cliente");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="overflow-x-auto">
      {isLoading && (
        <div className="text-center py-4">Cargando clientes...</div>
      )}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      {!isLoading && !error && clients.length === 0 && (
        <div className="text-center py-4">No hay clientes disponibles</div>
      )}
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
                  onClick={() => handleDelete(item.id)}
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
  );
}
