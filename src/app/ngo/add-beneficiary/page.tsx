"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RouteGuard from "@/components/auth/RouteGuard";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AddBeneficiaryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    bplStatus: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.age || !formData.income) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await api.createBeneficiary({
        name: formData.name,
        age: parseInt(formData.age),
        income: parseFloat(formData.income),
        bplStatus: formData.bplStatus,
      });

      toast({
        title: "Success",
        description: "Beneficiary added successfully",
      });

      // Redirect to beneficiaries list
      router.push("/ngo/beneficiaries");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add beneficiary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RouteGuard allowedRole="ngo">
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-white">Add Beneficiary</h1>
        <p className="text-blue-100 text-xs md:text-sm">
          Register a new beneficiary for insurance coverage
        </p>
      </div>

      <Card className="p-4 md:p-6 w-full max-w-xl bg-white shadow-lg border-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Full Name *
            </label>
            <Input
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-blue-200 focus:border-blue-400 text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Age *
            </label>
            <Input
              type="number"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="border-blue-200 focus:border-blue-400 text-sm md:text-base"
              min="0"
              max="150"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Annual Income (₹) *
            </label>
            <Input
              type="number"
              placeholder="Enter annual income"
              value={formData.income}
              onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              className="border-blue-200 focus:border-blue-400 text-sm md:text-base"
              min="0"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="bpl"
              checked={formData.bplStatus}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, bplStatus: checked as boolean })
              }
            />
            <label
              htmlFor="bpl"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              BPL Card Holder
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Beneficiary"
            )}
          </Button>

          <p className="text-xs text-slate-500 text-center">
            All fields marked with * are required
          </p>
        </form>
      </Card>
    </RouteGuard>
  );
}
