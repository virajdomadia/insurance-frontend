import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

const beneficiaries = [
  {
    id: "BEN-001",
    name: "Sita Devi",
    district: "Thane",
    status: "Covered",
  },
  {
    id: "BEN-002",
    name: "Raju Patel",
    district: "Palghar",
    status: "Pending",
  },
];

export default function BeneficiariesPage() {
  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Beneficiaries</h1>
      </div>

      <div className="space-y-4 w-full max-w-2xl">
        {beneficiaries.map((b) => (
          <Card key={b.id} className="p-4 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 bg-white shadow-lg border-0">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm md:text-base text-slate-800">{b.name}</p>
              <p className="text-xs md:text-sm text-slate-600">
                {b.district} · {b.id}
              </p>
            </div>

            <Badge variant={b.status === "Covered" ? "default" : "outline"} className={`text-xs shrink-0 ${b.status === "Covered" ? "bg-blue-600" : "bg-yellow-600 text-white border-transparent"}`}>
              {b.status}
            </Badge>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
