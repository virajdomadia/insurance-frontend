"use client";

import { useEffect, useState } from "react";
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

  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    let role = localStorage.getItem("role") as Role | null;

    // 🔁 Infer role from URL (fallback)
    if (!role) {
      if (pathname.startsWith("/citizen")) role = "citizen";
      else if (pathname.startsWith("/ngo")) role = "ngo";
      else if (pathname.startsWith("/admin")) role = "admin";

      if (role) {
        localStorage.setItem("role", role);
      }
    }

    // ❌ No role → login
    if (!role) {
      router.replace("/login");
      return;
    }

    // ❌ Role mismatch → redirect
    if (role !== allowedRole) {
      if (role === "citizen") router.replace("/citizen/dashboard");
      if (role === "ngo") router.replace("/ngo/dashboard");
      if (role === "admin") router.replace("/admin/dashboard");
      return;
    }

    // ✅ Role is allowed
    setIsAllowed(true);
  }, [allowedRole, pathname, router]);

  // ⛔ Block render until validated
  if (!isAllowed) return null;

  return <>{children}</>;
}
