"use client";
import React, { useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace("/login");
        return;
      }
      
      if (!user) {
        router.replace("/login");
        return;
      }

      const userRole = user.role?.toLowerCase?.() ?? "";
      const allowed = allowedRoles.map((r) => r.toLowerCase());
      
      if (!allowed.includes(userRole)) {
        // User doesn't have required role, redirect to appropriate dashboard
        router.replace("/");
      }
    }
  }, [loading, user, token, allowedRoles, router]);

  if (loading) return null;
  if (!token) return null;
  if (!user) return null;
  
  const userRole = user.role?.toLowerCase?.() ?? "";
  const allowed = allowedRoles.map((r) => r.toLowerCase());
  
  if (!allowed.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
