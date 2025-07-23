import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function TerminalGroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
} 