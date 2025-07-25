import DashboardLayout from "@/components/DashboardLayout";

export default function TerminalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
} 