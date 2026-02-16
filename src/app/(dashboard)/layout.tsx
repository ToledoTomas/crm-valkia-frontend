import Sidebar from "../(components)/Sidebar";
import MobileSidebar from "../(components)/MobileSidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-full w-full overflow-hidden bg-gray-100 flex-col md:flex-row">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>
        <div className="md:hidden flex items-center bg-white border-b p-4">
          <MobileSidebar />
          <div className="ml-4 font-semibold text-xl">Valkia</div>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
