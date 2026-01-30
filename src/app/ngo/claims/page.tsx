"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface Claim {
  _id: string;
  policyType: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  beneficiaryId?: string;
  userId?: string;
}

export default function NgoClaimsPage() {
  const { toast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const data = await api.getClaims();
      setClaims(data);
    } catch (error: any) {
      toast({
        title: "Error loading claims",
        description: "Failed to fetch claims data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Claims Support</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track and manage claims for your beneficiaries
        </p>
      </div>

      <div className="space-y-4 w-full max-w-4xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 bg-white shadow-sm border border-slate-200">
              <Skeleton className="h-6 w-48 mb-3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))
        ) : claims.length === 0 ? (
          // Empty state
          <Card className="p-12 bg-white shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-900">No claims found</p>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              You haven't submitted any claim requests for your beneficiaries yet.
            </p>
          </Card>
        ) : (
          // Claims list
          <div className="grid grid-cols-1 gap-4">
            {claims.map((claim) => (
              <Card key={claim._id} className="p-5 bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {claim._id}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {claim.policyType}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {claim.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full md:w-auto gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Amount</p>
                      <p className="text-lg font-bold text-slate-900">₹{claim.amount.toLocaleString()}</p>
                    </div>

                    <Badge
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide border ${claim.status === 'APPROVED'
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : claim.status === 'REJECTED'
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                    >
                      {claim.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
