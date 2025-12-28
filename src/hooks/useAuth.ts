"use client";
import { useAuthContext } from "@/lib/AuthContext";

export default function useAuth() {
  return useAuthContext();
}
