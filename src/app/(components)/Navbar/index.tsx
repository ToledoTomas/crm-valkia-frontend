"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-center items-center py-4 border-b-gray-200 border-b-2">
      <h1 className="text-xl font-bold mr-36">Valkia</h1>
      <ul className="flex space-x-8">
        <li>
          <Link href="/" className="hover:text-blue-500">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/productos" className="hover:text-blue-500">
            Productos
          </Link>
        </li>
        <li>
          <Link href="/ordenes" className="hover:text-blue-500">
            Ordenes
          </Link>
        </li>
        <li>
          <Link href="/clientes" className="hover:text-blue-500">
            Clientes
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
