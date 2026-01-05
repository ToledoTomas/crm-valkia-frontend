"use client";

import Link from "next/link";
import Tables from "./_components/Table";
import Search from "../../(components)/Search";

const pageClientes = () => {
  return (
    <div>
      <div className="m-12 flex flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl mb-4">Clientes</h2>
          <Search />
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
        <Tables />
      </div>
    </div>
  );
};

export default pageClientes;
