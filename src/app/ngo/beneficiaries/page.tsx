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
      <h1 className="text-2xl font-semibold mb-4">Beneficiaries</h1>

      <div className="space-y-4 max-w-2xl">
        {beneficiaries.map((b) => (
          <Card key={b.id} className="p-4 flex justify-between">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-slate-500">
                {b.district} · {b.id}
              </p>
            </div>

            <Badge variant={b.status === "Covered" ? "default" : "outline"}>
              {b.status}
            </Badge>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
