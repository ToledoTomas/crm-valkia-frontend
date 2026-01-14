"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tables, { Customer } from "./_components/Tables/index";
import Search from "../../(components)/Search";
import { getClients, deleteClientId } from "./api";

const PageClientes = () => {
  const [clients, setClients] = useState<Customer[]>([]);
  const [allClients, setAllClients] = useState<Customer[]>([]); // Store all clients
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getClients();
      setClients(res);
      setAllClients(res); // Save to separate state for filtering
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching clients");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = React.useCallback(
    (term: string) => {
      // Client-side filtering
      if (term.trim() === "") {
        setClients(allClients);
      } else {
        const lowerTerm = term.toLowerCase();
        const filtered = allClients.filter(
          (client) =>
            client.fullname.toLowerCase().includes(lowerTerm) ||
            client.email.toLowerCase().includes(lowerTerm) ||
            client.phone.includes(term)
        );
        setClients(filtered);
      }
    },
    [allClients]
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteClientId(id);
      // Update both states
      const filtered = clients.filter((client) => client.id !== id);
      const filteredAll = allClients.filter((client) => client.id !== id);
      setClients(filtered);
      setAllClients(filteredAll);
    } catch (err: unknown) {
      console.error("Error deleting client:", err);
      alert("Error al eliminar el cliente");
    }
  };

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchClients();
      hasFetched.current = true;
    }
  }, [fetchClients]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl mb-4">Clientes</h2>
          <Search onSearch={handleSearch} />
        </div>
        <Link
          href="/clientes/agregar-clientes"
          className="mt-2 text-nowrap p-3 rounded-md flex flex-row items-center gap-2 bg-[#e5e5d0] text-black cursor-pointer hover:bg-[#d8d8b9]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
          Agregar Cliente
        </Link>
      </div>
      <div className="w-full border border-gray-200 rounded-lg">
        <Tables
          clients={clients}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PageClientes;
