"use client";

import * as React from "react";
import { useActionState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction, type initialState } from "@/feature/auth/actions";
import { FieldError } from "@/components/ui/field";
import { useActionToast } from "@/hooks/use-action-toast";
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  const [showPassword, setShowPassword] = React.useState(false);

  const initialState: initialState = {
    success: false,
    message: "",
  };
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  useActionToast(state);
  React.useEffect(() => {
    return () => {
      React.startTransition(() => {
        formAction({ type: "RESET" });
      });
    };
  }, [formAction]);
  return (
    <div className="relative w-full max-w-md mx-auto mt-[100px] group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-muted via-border to-muted rounded-2xl opacity-30 blur-sm group-hover:opacity-70 transition duration-1000" />

      <Card className="relative bg-card border-border text-card-foreground shadow-2xl rounded-2xl">
        <CardHeader className="space-y-1.5 pt-6 px-6">
          <CardTitle className="text-2xl font-bold">New password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="otp" value={otp} />
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <Input name="confirmPassword" type="password" />
              <FieldError>
                {state?.errors?.confirmPassword &&
                  state?.errors?.confirmPassword[0]}
              </FieldError>
            </div>

            <Button type="submit" disabled={isPending} className="w-full mt-2">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
