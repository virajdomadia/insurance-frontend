import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

export default function AddBeneficiaryPage() {
  return (
    <RouteGuard allowedRole="ngo">
      <h1 className="text-2xl font-semibold mb-4">Add Beneficiary</h1>

      <Card className="p-6 max-w-xl space-y-4">
        <Input placeholder="Full Name" />
        <Input placeholder="Aadhaar / ID Number" />
        <Input placeholder="District" />
        <Input placeholder="Annual Income" />

        <Button className="w-full">
          Save Beneficiary
        </Button>

        <p className="text-xs text-slate-500">
          Demo only · Documents upload simulated
        </p>
      </Card>
    </RouteGuard>
  );
}
