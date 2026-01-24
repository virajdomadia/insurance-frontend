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
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRole="citizen">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Policy Wallet</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          All active and past insurance policies
        </p>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="p-4 md:p-6 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))
        ) : policies.length === 0 ? (
          // Empty state
          <Card className="p-8 bg-white shadow-lg border-0 text-center">
            <p className="text-slate-600">No policies found</p>
            <p className="text-sm text-slate-400 mt-1">
              You don't have any insurance policies yet.
            </p>
          </Card>
        ) : (
          // Policies list
          policies.map((policy) => (
            <Card key={policy._id} className="p-4 md:p-6 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {policy.policyType}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Coverage up to ₹{policy.coverage.toLocaleString()}
                  </p>
                </div>

                <Badge className={policy.status === 'ACTIVE' ? 'bg-green-600' : 'bg-yellow-600'}>
                  {policy.status}
                </Badge>
              </div>

              <div className="mt-4 text-sm space-y-1 text-slate-600">
                <p><strong className="text-slate-800">Valid Till:</strong> {new Date(policy.endDate).toLocaleDateString()}</p>
                <p><strong className="text-slate-800">Premium:</strong> ₹{policy.premium} / year</p>
                <p><strong className="text-slate-800">Start Date:</strong> {new Date(policy.startDate).toLocaleDateString()}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </RouteGuard>
  );
}
