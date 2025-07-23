import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TerminalMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 