"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Productos", path: "/productos" },
    { name: "Ordenes", path: "/ordenes" },
    { name: "Clientes", path: "/clientes" },
  ];

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <h1 className="text-2xl font-bold mb-8 text-center text-white">Valkia</h1>
      <ul className="flex flex-col space-y-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block p-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-sky-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <Link
          href="/login"
          className="block p-3 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
        >
          Cerrar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
