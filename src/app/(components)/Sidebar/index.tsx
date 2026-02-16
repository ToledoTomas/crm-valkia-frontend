"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

const Sidebar = ({ className, onLinkClick }: SidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Ventas", path: "/ventas", icon: ShoppingCart },
    { name: "Productos", path: "/productos", icon: Package },
    { name: "Stock", path: "/stock", icon: Warehouse },
    { name: "Clientes", path: "/clientes", icon: Users },
    { name: "Reportes", path: "/reportes", icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div
      className={cn(
        "h-full w-64 bg-[#fbfbf2] text-foreground flex flex-col p-4 shadow-lg border-r",
        className
      )}
    >
      <h1 className="text-2xl font-semibold mb-8 text-center text-black">
        Valkia
      </h1>
      <ul className="flex flex-col space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={onLinkClick}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#e5e5d0] text-black font-medium"
                    : "hover:bg-[#f0f0e0] text-gray-600 hover:text-black"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
        <Link
          href="/configuracion"
          onClick={onLinkClick}
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
            pathname.startsWith("/configuracion")
              ? "bg-[#e5e5d0] text-black font-medium"
              : "hover:bg-[#f0f0e0] text-gray-600 hover:text-black"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
        <Link
          href="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
