"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface Policy {
  _id: string;
  policyType: string;
  coverage: number;
  premium: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export default function PolicyWalletPage() {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await api.getPolicies();
      setPolicies(data);
    } catch (error: any) {
      toast({
        title: "Error loading policies",
        description: "Failed to fetch policy data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Policy Wallet</h1>
        <p className="text-slate-500 text-sm mt-1">
          All active and past insurance policies
        </p>
      </div>

      <div className="space-y-4 w-full max-w-4xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-6 bg-white shadow-sm border border-slate-200">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </Card>
          ))
        ) : policies.length === 0 ? (
          // Empty state
          <Card className="p-12 bg-white shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900">No policies found</p>
            <p className="text-sm text-slate-500 mt-1">
              You don't have any active insurance policies yet.
            </p>
          </Card>
        ) : (
          // Policies list
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <Card key={policy._id} className="relative overflow-hidden bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                <div className="absolute top-0 right-0 p-4">
                  <Badge
                    className={policy.status === 'ACTIVE'
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                    }
                  >
                    {policy.status}
                  </Badge>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-1">Health & Life</p>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors">
                      {policy.policyType}
                    </h3>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">Coverage</span>
                      <span className="text-lg font-bold text-slate-900">₹{policy.coverage.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full w-[0%] animate-[width_1s_ease-out_forwards] w-3/4"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">PREMIUM</p>
                      <p className="font-semibold text-slate-700">₹{policy.premium > 0 ? `${policy.premium}/yr` : 'Free'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">VALID TILL</p>
                      <p className="font-semibold text-slate-700">{new Date(policy.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-mono">ID: {policy._id}</span>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
