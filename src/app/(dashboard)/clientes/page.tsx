"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tables, { Customer } from "./_components/Tables/index";
import Search from "../../(components)/Search";
import { getClients, searchByFullname, deleteClientId } from "./api";

const PageClientes = () => {
  const [clients, setClients] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getClients();
      setClients(res);
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
    async (term: string) => {
      try {
        setIsLoading(true);
        setError(null);
        if (term.trim() === "") {
          await fetchClients();
        } else {
          const res = await searchByFullname(term);
          setClients(res);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error searching clients");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchClients]
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteClientId(id);
      setClients(clients.filter((client) => client.id !== id));
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
      <div className="m-12 flex flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl mb-4">Clientes</h2>
          <Search onSearch={handleSearch} />
        </div>
        <Link
          href="/clientes/agregar-clientes"
          className="mt-2 p-3 rounded-md flex flex-row items-center gap-2 bg-sky-200 cursor-pointer hover:bg-sky-300"
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
      <div className="m-12 w-full overflow-auto border border-gray-200 rounded-lg">
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
