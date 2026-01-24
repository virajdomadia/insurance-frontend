"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  income: number;
  bplStatus: boolean;
  ngoId?: string;
  createdAt: string;
}

export default function BeneficiariesPage() {
  const { toast } = useToast();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const data = await api.getBeneficiaries();
      setBeneficiaries(data);
    } catch (error: any) {
      toast({
        title: "Error loading beneficiaries",
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
        <h1 className="text-xl md:text-2xl font-semibold text-white">Beneficiaries</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Manage your registered beneficiaries
        </p>
      </div>

      <div className="space-y-4 w-full max-w-3xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 bg-white shadow-lg border-0">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </Card>
          ))
        ) : beneficiaries.length === 0 ? (
          // Empty state
          <Card className="p-8 bg-white shadow-lg border-0 text-center">
            <p className="text-slate-600">No beneficiaries found</p>
            <p className="text-sm text-slate-400 mt-1">
              Add beneficiaries from the "Add Beneficiary" page
            </p>
          </Card>
        ) : (
          // Beneficiaries list
          beneficiaries.map((b) => (
            <Card
              key={b.id}
              className="p-4 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 bg-white shadow-lg border-0 hover:shadow-xl transition-shadow"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm md:text-base text-slate-800">{b.name}</p>
                <p className="text-xs md:text-sm text-slate-600 mt-1">
                  Age: {b.age} · Income: ₹{b.income.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  ID: {b.id.substring(0, 8)}...
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {b.bplStatus && (
                  <Badge className="text-xs bg-green-600">
                    BPL
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Registered
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </RouteGuard>
  );
}
