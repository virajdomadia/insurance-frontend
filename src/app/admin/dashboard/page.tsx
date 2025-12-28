"use client";
import React from "react";
import RoleGuard from "@/components/RoleGuard";
import useAuth from "@/hooks/useAuth";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
      </div>
    </RoleGuard>
  );
}
