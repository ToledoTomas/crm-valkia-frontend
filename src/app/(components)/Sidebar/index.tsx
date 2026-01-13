"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Productos", path: "/productos" },
    { name: "Órdenes", path: "/ordenes" },
    { name: "Clientes", path: "/clientes" },
  ];

  return (
    <div className="h-full w-64 bg-[#fbfbf2] text-foreground flex flex-col p-4 shadow-lg border-r">
      <h1 className="text-2xl font-semibold mb-8 text-center text-black">
        Valkia
      </h1>
      <ul className="flex flex-col space-y-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#e5e5d0] text-black font-medium"
                    : "hover:bg-[#f0f0e0] text-gray-600 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Link
          href="/login"
          className="block p-3 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
        >
          Cerrar Sesión
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
