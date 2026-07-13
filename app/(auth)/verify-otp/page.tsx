"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { emailOtp } from "@/lib/auth-client";
import { toast } from "sonner";
export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  const handleVerifyOtp = async (formData: FormData) => {
    console.log(formData.get("otp"));
    let otp = formData.get("otp") as string;
    setIsPending(true);
    try {
      let res = await emailOtp.checkVerificationOtp({
        email,
        otp,
        type: "forget-password",
      });
      if (res?.data?.success) {
        toast.success("OTP verification success");
        router.push(`/reset-password?email=${email}&otp=${otp}`);
      } else {
        toast.error(res?.error?.message || "OTP verification failed");
      }
    } catch (error) {
      console.log("error on verification");
    } finally {
      setIsPending(false);
    }
  };

  const hadleResendOTP = async () => {
    try {
      let res = await emailOtp.sendVerificationOtp({
        email,
        type: "forget-password",
      });
      if (res?.data?.success) {
        toast.success("OTP resent to your email");
      } else {
        toast.error("Failed on sending OTP");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-[100px] group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-muted via-border to-muted rounded-2xl opacity-30 blur-sm group-hover:opacity-70 transition duration-1000" />

      <Card className="relative bg-card border-border text-card-foreground shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1.5 pt-6 px-6">
          <CardTitle className="text-2xl font-bold">Verify code</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          <form action={handleVerifyOtp} className="space-y-4">
            <Input type="hidden" name="email" value={email} />
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Verification Code
              </label>
              <Input
                name="otp"
                placeholder="000000"
                maxLength={6}
                className="text-center text-lg tracking-[0.5em] font-mono bg-background border-input focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={hadleResendOTP}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Didn't receive a code? Resend
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
