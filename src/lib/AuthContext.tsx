"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type User = {
  id: string;
  email: string;
  role: "CITIZEN" | "NGO" | "ADMIN";
  isActive: boolean;
  createdAt: string;
} | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<{ ok: boolean; message?: string; user?: User }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  authenticatedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiBase = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000") : "";

  // Initialize token from sessionStorage on mount
  useEffect(() => {
    try {
      const t = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
      if (t) {
        setToken(t);
      }
    } catch (e) {
      console.warn("Auth init failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToken = useCallback((t: string) => {
    setToken(t);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", t);
      }
    } catch (e) {
      console.warn("Saving token failed", e);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
      }
    } catch (e) {
      console.warn("Clearing auth failed", e);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Registration failed";
        return { ok: false, message };
      }
      return { ok: true, user: data as User };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "Registration error" };
    }
  }, [apiBase]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        credentials: "include", // CRITICAL: include cookies for refresh token
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "Login failed";
        return { ok: false, message };
      }

      // Extract accessToken from response
      if (data.accessToken) {
        saveToken(data.accessToken);
        // Extract user info from JWT or response
        try {
          const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
          setUser({
            id: payload.sub || "",
            email: email,
            role: payload.role || "CITIZEN",
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Failed to parse JWT", e);
        }
        return { ok: true };
      }
      return { ok: false, message: "No token returned" };
    } catch (e: any) {
      return { ok: false, message: e?.message ?? "Login error" };
    }
  }, [apiBase, saveToken]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Send refresh token cookie
      });
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          saveToken(data.accessToken);
          return true;
        }
      }
      clearAuth();
      return false;
    } catch (e) {
      clearAuth();
      return false;
    }
  }, [apiBase, saveToken, clearAuth]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(`${apiBase}/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }).catch(() => {}); // Ignore errors on logout
      } catch (e) {
        console.warn("Logout error", e);
      }
    }
    clearAuth();
  }, [token, apiBase, clearAuth]);

  // Auto-refresh token before it expires (every 13 minutes)
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(() => {
      refresh();
    }, 13 * 60 * 1000);
    return () => clearInterval(timer);
  }, [token, refresh]);

  const authenticatedFetch = useCallback(
    async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
      let currentToken = token;
      const headers = new Headers(init.headers || {});

      if (currentToken) {
        headers.set("Authorization", `Bearer ${currentToken}`);
      }

      let response = await fetch(input, {
        ...init,
        credentials: "include",
        headers,
      });

      // Auto-refresh on 401 (token expired)
      if (response.status === 401 && currentToken) {
        const refreshed = await refresh();
        if (refreshed) {
          currentToken = token;
          headers.set("Authorization", `Bearer ${currentToken}`);
          response = await fetch(input, {
            ...init,
            credentials: "include",
            headers,
          });
        } else {
          // Refresh failed, redirect to login
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      return response;
    },
    [token, refresh]
  );

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, refresh, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
