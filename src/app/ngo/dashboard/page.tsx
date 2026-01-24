"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import RouteGuard from "@/components/auth/RouteGuard";

export default function NgoDashboard() {
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [beneficiariesData, claimsData] = await Promise.all([
        api.getBeneficiaries(),
        api.getClaims(),
      ]);
      setBeneficiaries(beneficiariesData);
      setClaims(claimsData);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pendingClaims = claims.filter((c) => c.status === "PENDING").length;
  const approvedClaims = claims.filter((c) => c.status === "APPROVED").length;

  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">NGO Dashboard</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Overview of beneficiaries and claims support
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {/* Beneficiaries */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Beneficiaries</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              {beneficiaries.length}
            </p>
          )}
        </Card>

        {/* Total Claims */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
          <p className="text-xs md:text-sm text-slate-500">Total Claims</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-blue-600">
              {claims.length}
            </p>
          )}
          {!loading && (
            <p className="text-xs text-slate-400 mt-1">
              {approvedClaims} Approved
            </p>
          )}
        </Card>

        {/* Pending Claims */}
        <Card className="p-4 md:p-6 bg-white shadow-lg border-0 sm:col-span-2 md:col-span-1">
          <p className="text-xs md:text-sm text-slate-500">Pending Claims</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold mt-2 text-orange-600">
              {pendingClaims}
            </p>
          )}
        </Card>
      </div>
    </RouteGuard>
  );
}
