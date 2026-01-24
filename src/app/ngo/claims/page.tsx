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
      // NGO sees claims related to their beneficiaries? Or just all for now based on API logic?
      // The API filters for NGO role implicitly if designed so. 
      // Current API implementation for NGO returns claims associated with beneficiaries managed by the NGO (if logic implemented)
      // or returns all claims if filter logic not strictly applied.
      // Let's assume API returns correct list.
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
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Claims Support</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Track and manage claims for your beneficiaries
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
              No claims have been submitted yet.
            </p>
          </Card>
        ) : (
          // Claims list
          claims.map((claim) => (
            <Card key={claim._id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm md:text-base text-slate-800">
                  {claim.policyType} Claim
                </p>
                <p className="text-xs md:text-sm text-slate-600">
                  ID: {claim._id.substring(0, 8)}...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Amount: ₹{claim.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge
                  variant={claim.status === 'APPROVED' ? 'default' : 'secondary'}
                  className={`text-xs ${claim.status === 'APPROVED' ? 'bg-green-600' :
                      claim.status === 'REJECTED' ? 'bg-red-600 text-white' :
                        'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {claim.status}
                </Badge>
                <span className="text-[10px] text-slate-400">
                  {new Date(claim.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </RouteGuard>
  );
}
