"use client";
import React from "react";
import RoleGuard from "@/components/RoleGuard";
import useAuth from "@/hooks/useAuth";

export default function CitizenDashboardPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={["citizen"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-700">Citizen Dashboard</h1>
      </div>
    </RoleGuard>
  );
}
