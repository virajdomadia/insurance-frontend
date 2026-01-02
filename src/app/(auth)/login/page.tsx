"use client";

import { useEffect, useState } from "react";
import { demoUsers } from "@/data/users";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type Step = "PHONE" | "OTP";

export default function LoginPage() {
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState<any>(null);
  const [timer, setTimer] = useState(30);

  // OTP resend timer
  useEffect(() => {
    if (step === "OTP" && timer > 0) {
      const t = setTimeout(() => setTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const submitPhone = () => {
    const foundUser = demoUsers.find((u) => u.phone === phone);

    if (!foundUser) {
      toast({
        title: "Number not registered",
        description: "Please use a demo phone number",
        variant: "destructive",
      });
      return;
    }

    setUser(foundUser);
    setStep("OTP");
    setTimer(30);

    toast({
      title: "OTP sent (Demo)",
      description: `Use OTP: ${foundUser.otp}`,
    });
  };

  const submitOtp = () => {
    if (otp !== user.otp) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);

    toast({
      title: "Login successful",
      description: `Welcome ${user.name}`,
    });

    if (user.role === "citizen") location.href = "/citizen/dashboard";
    if (user.role === "ngo") location.href = "/ngo/dashboard";
    if (user.role === "admin") location.href = "/admin/dashboard";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 px-4 py-8">
      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl border-0">
        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">
            NGO Insurance
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Secure access for citizens, NGOs & CSR partners
          </p>
        </div>

        {/* PHONE STEP */}
        {step === "PHONE" && (
          <>
            <label className="text-xs md:text-sm font-medium">
              Mobile number
            </label>

            <div className="flex mt-2">
              <span className="px-2 md:px-3 flex items-center border border-r-0 rounded-l text-slate-600 text-xs md:text-sm bg-blue-50 border-blue-200">
                +91
              </span>
              <Input
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="rounded-l-none border-blue-200 focus:border-blue-400 text-sm md:text-base"
              />
            </div>

            <Button
              className="w-full mt-4 md:mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
              disabled={phone.length !== 10}
              onClick={submitPhone}
            >
              Continue
            </Button>
          </>
        )}

        {/* OTP STEP */}
        {step === "OTP" && (
          <>
            <p className="text-xs md:text-sm text-slate-600 mb-4">
              Enter the 6-digit OTP sent to <br />
              <span className="font-medium">
                +91 {phone.replace(/.(?=.{2})/g, "•")}
              </span>
            </p>

            <Input
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="tracking-widest text-center text-base md:text-lg border-blue-200 focus:border-blue-400"
            />

            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base"
              disabled={otp.length !== 6}
              onClick={submitOtp}
            >
              Verify & Login
            </Button>

            <div className="flex justify-between items-center mt-4 text-xs text-slate-500">
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button
                  onClick={submitPhone}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend OTP
                </button>
              )}

              <button
                onClick={() => {
                  setStep("PHONE");
                  setOtp("");
                }}
                className="hover:underline"
              >
                Change number
              </button>
            </div>
          </>
        )}

        {/* FOOTER */}
        <p className="text-[11px] text-slate-400 text-center mt-6">
          Demo environment · OTP is simulated · No real SMS sent
        </p>
      </Card>
    </div>
  );
}
