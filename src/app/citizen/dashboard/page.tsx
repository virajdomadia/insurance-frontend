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
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome, {profile?.name || profile?.email}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage your insurance policies and claims
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-base md:text-lg text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Policy
              </h3>
              {activePolicy ? (
                <>
                  <p className="mt-4 text-sm text-slate-600 font-medium">
                    {activePolicy.policyType}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    ₹{(activePolicy.coverage / 1000).toFixed(0)}k <span className="text-base font-normal text-slate-500">coverage</span>
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                      Expires: {new Date(activePolicy.endDate).toLocaleDateString()}
                    </p>
                    <Badge className={`text-xs ${activePolicy.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700'}`}>
                      {activePolicy.status}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-3">No active policies found.</p>
                  <Badge variant="outline" className="text-xs border-blue-600 text-blue-600 bg-blue-50">
                    Check Eligibility
                  </Badge>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-base md:text-lg text-slate-800">Support Status</h3>
              <p className="mt-2 text-sm text-slate-600">
                Need help with your insurance?
              </p>
              <div className="mt-6 flex gap-2">
                <Badge className="bg-blue-600 text-xs cursor-pointer hover:bg-blue-700 py-1.5 px-3">
                  Contact NGO Partner
                </Badge>
              </div>
            </Card>

            <Card className="p-6 md:col-span-2 bg-white shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-base md:text-lg text-slate-800 mb-4">Claims History</h3>

              {claims.length > 0 ? (
                <div className="space-y-3">
                  {claims.map((c) => (
                    <div key={c._id} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{c.policyType} Claim</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(c.createdAt).toLocaleDateString()} — ₹{c.amount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={c.status === 'APPROVED' ? 'default' : 'secondary'} className={`text-xs ${c.status === 'APPROVED' ? 'bg-green-100 text-green-700' : c.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">No claims submitted yet.</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </RouteGuard>
  );
}
