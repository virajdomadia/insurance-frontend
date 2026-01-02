import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route } from "lucide-react";
import RouteGuard from "@/components/auth/RouteGuard";

export default function AddBeneficiaryPage() {
  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Add Beneficiary</h1>
      </div>

      <Card className="p-4 md:p-6 w-full max-w-xl space-y-4 bg-white shadow-lg border-0">
        <Input placeholder="Full Name" className="border-blue-200 focus:border-blue-400 text-sm md:text-base" />
        <Input placeholder="Aadhaar / ID Number" className="border-blue-200 focus:border-blue-400 text-sm md:text-base" />
        <Input placeholder="District" className="border-blue-200 focus:border-blue-400 text-sm md:text-base" />
        <Input placeholder="Annual Income" className="border-blue-200 focus:border-blue-400 text-sm md:text-base" />

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base">
          Save Beneficiary
        </Button>

        <p className="text-xs text-slate-500">
          Demo only · Documents upload simulated
        </p>
      </Card>
    </RouteGuard>
  );
}
