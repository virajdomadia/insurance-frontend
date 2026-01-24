"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface Claim {
  id: string;
  _id: string;
  policyType: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ClaimsPage() {
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
        <h1 className="text-xl md:text-2xl font-semibold text-white">Claims</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Track submitted insurance claims
        </p>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 bg-white shadow-lg border-0">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </Card>
          ))
        ) : claims.length === 0 ? (
          // Empty state
          <Card className="p-8 bg-white shadow-lg border-0 text-center">
            <p className="text-slate-600">No claims found</p>
            <p className="text-sm text-slate-400 mt-1">
              You haven't submitted any claims yet.
            </p>
          </Card>
        ) : (
          // Claims list
          claims.map((claim) => (
            <Card key={claim._id || claim.id} className="p-4 md:p-5 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 text-sm md:text-base truncate">
                    {claim.policyType} Claim
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600">
                    Amount: ₹{claim.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {claim.description || "No description provided"}
                  </p>
                </div>

                <Badge
                  variant={claim.status === 'APPROVED' ? 'default' : 'secondary'}
                  className={`text-xs shrink-0 ${claim.status === 'APPROVED' ? 'bg-green-600' :
                      claim.status === 'REJECTED' ? 'bg-red-600 text-white' :
                        'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {claim.status}
                </Badge>
              </div>

              <div className="mt-2 md:mt-3 text-xs text-slate-500">
                Submitted on {new Date(claim.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </RouteGuard>
  );
}
