"use client";
import React, { useState, useEffect } from "react";
import InitialLoader from "@/components/InitialLoader";
import { AuthProvider, useAuthContext } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!loading) {
      // Redirect unauthenticated users to login (unless already on public route)
      if (!token && !isPublicRoute) {
        router.replace("/login");
        return;
      }

      // Redirect authenticated users away from login/register
      if (token && isPublicRoute) {
        if (!user) {
          // User data not yet loaded from JWT, wait
          return;
        }
        // Redirect to appropriate dashboard based on role
        const mapRoleToPath = (role?: string) => {
          if (!role) return "/";
          const key = role.toLowerCase();
          if (key === "admin") return "/admin/dashboard";
          if (key === "citizen") return "/citizen/dashboard";
          if (key === "ngo") return "/ngo/dashboard";
          return "/";
        };
        const target = mapRoleToPath(user.role);
        router.replace(target);
      }
    }
  }, [loading, token, user, pathname, isPublicRoute, router]);

  // Show loading for public routes, otherwise require auth
  if (loading) {
    return isPublicRoute ? <>{children}</> : null;
  }

  if (!token && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [loaderDone, setLoaderDone] = useState(false);

  if (!loaderDone) {
    return <InitialLoader onFinish={() => setLoaderDone(true)} />;
  }

  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
