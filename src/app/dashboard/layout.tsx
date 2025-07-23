"use client";

import DashboardLayout from "@/components/DashboardLayout";
import React from "react";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}