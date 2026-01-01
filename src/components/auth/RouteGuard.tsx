"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type Role = "citizen" | "ngo" | "admin";

export default function RouteGuard({
  allowedRole,
  children,
}: {
  allowedRole: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let role = localStorage.getItem("role") as Role | null;

    // ✅ FALLBACK: infer role from URL
    if (!role) {
      if (pathname.startsWith("/citizen")) role = "citizen";
      else if (pathname.startsWith("/ngo")) role = "ngo";
      else if (pathname.startsWith("/admin")) role = "admin";

      // sync for future navigations
      if (role) {
        localStorage.setItem("role", role);
      }
    }

    // ❌ still no role → login
    if (!role) {
      router.replace("/login");
      return;
    }

    // ❌ role mismatch → redirect to correct dashboard
    if (role !== allowedRole) {
      if (role === "citizen") router.replace("/citizen/dashboard");
      if (role === "ngo") router.replace("/ngo/dashboard");
      if (role === "admin") router.replace("/admin/dashboard");
    }
  }, [allowedRole, pathname, router]);

  return <>{children}</>;
}
