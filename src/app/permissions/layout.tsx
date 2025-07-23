'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PermissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <ProtectedRoute allowedRoles={['admin']}>
        {children}
      </ProtectedRoute>
    </DashboardLayout>
  );
} 