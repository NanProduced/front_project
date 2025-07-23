import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TerminalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin", "operator"]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
} 