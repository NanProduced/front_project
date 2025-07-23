import DashboardLayout from "@/components/DashboardLayout";

export default function DevicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}