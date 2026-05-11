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
      <div className="flex h-full w-full overflow-hidden bg-background flex-col md:flex-row">
        <div className="hidden md:block h-full">
          <Sidebar />
        </div>
        <div className="md:hidden flex items-center bg-card border-b border-border p-4">
          <MobileSidebar />
          <div className="ml-4 text-xl font-semibold text-foreground">Valkia</div>
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
