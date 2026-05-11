"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
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
    { name: "Clientes", path: "/clientes", icon: Users },
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
        "h-full w-64 border-r border-border bg-card text-foreground flex flex-col p-4 shadow-sm",
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
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
          className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
            pathname.startsWith("/configuracion")
              ? "bg-primary text-primary-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
        <Link
          href="/login"
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
