"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import RouteGuard from "@/components/auth/RouteGuard";

export default function CitizenDashboard() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileData, policiesData, claimsData] = await Promise.all([
        api.getMe(),
        api.getPolicies(),
        api.getClaims(),
      ]);
      setProfile(profileData);
      setPolicies(policiesData);
      setClaims(claimsData);
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activePolicy = policies.find((p) => p.status === "ACTIVE") || policies[0];

  return (
    <RouteGuard allowedRole="citizen">
      {loading ? (
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 bg-white/20 mb-2" />
            <Skeleton className="h-4 w-48 bg-white/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-20" />
            </Card>
            <Card className="p-6 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-20" />
            </Card>
            <Card className="p-6 md:col-span-2 bg-white shadow-lg border-0">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-semibold text-white">
              Welcome, {profile?.name || profile?.email}
            </h1>
            <p className="text-blue-100 text-xs md:text-sm">
              Manage your insurance policies and claims
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Active Policy</h3>
              {activePolicy ? (
                <>
                  <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-600">
                    {activePolicy.policyType} Coverage (₹{(activePolicy.coverage / 1000).toFixed(0)}k)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Valid until {new Date(activePolicy.endDate).toLocaleDateString()}
                  </p>
                  <Badge className={`mt-3 md:mt-4 text-xs ${activePolicy.status === 'ACTIVE' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {activePolicy.status}
                  </Badge>
                </>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-3">No active policies found.</p>
                  <Badge variant="outline" className="text-xs border-blue-600 text-blue-600">
                    Check Eligibility
                  </Badge>
                </div>
              )}
            </Card>

            <Card className="p-4 md:p-6 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Support Status</h3>
              <p className="mt-3 md:mt-4 text-xs md:text-sm text-slate-600">
                Need help with your insurance?
              </p>
              <div className="mt-4 flex gap-2">
                <Badge className="bg-blue-600 text-xs cursor-pointer hover:bg-blue-700">
                  Contact NGO
                </Badge>
              </div>
            </Card>

            <Card className="p-4 md:p-6 md:col-span-2 bg-white shadow-lg border-0">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Claims History</h3>

              {claims.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {claims.map((c) => (
                    <div key={c._id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.policyType} Claim</p>
                        <p className="text-xs text-slate-500">
                          {new Date(c.createdAt).toLocaleDateString()} — ₹{c.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={c.status === 'APPROVED' ? 'default' : 'secondary'} className={`text-xs ${c.status === 'APPROVED' ? 'bg-green-600' : c.status === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}>
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">No claims submitted yet.</p>
              )}
            </Card>
          </div>
        </>
      )}
    </RouteGuard>
  );
}
