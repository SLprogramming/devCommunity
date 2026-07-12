"use client";

import * as React from "react";
import { Eye, EyeOff, GitBranch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type initialState, signInAction } from "../actions";
import { signIn } from "@/lib/auth-client";
import { useActionState } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginForm() {
  const initialState: initialState = {
    message: "",
    success: false,
    fields: {
      email: "",
    },
    toast: {
      message: "",
      type: "info",
      timestamp: 0,
    },
  };
  const [isSocialLoginPending, setIsSocialLoginPending] = React.useState(false);
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );
  const [showPassword, setShowPassword] = React.useState(false);
  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsSocialLoginPending(true);
    await signIn.social({
      provider,
      callbackURL: "/",
    });
    setIsSocialLoginPending(false);
  };

  React.useEffect(() => {
    if (state?.toast?.type && state?.toast?.message) {
      toast[state?.toast?.type](state?.toast?.message);
    }
    if (!state?.toast?.type) {
      toast(state?.toast?.message);
    }
  }, [state?.toast?.timestamp]);
  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Dynamic background glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-muted via-border to-muted rounded-2xl opacity-30 dark:opacity-50 blur-sm group-hover:opacity-70 transition duration-1000" />

      {/* Main Card Container */}
      <Card className="relative bg-card border-border text-card-foreground shadow-2xl rounded-2xl transition-colors duration-200">
        <CardHeader className="space-y-1.5 pt-6 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your credentials to access your developer account
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <Input
                name="email"
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                defaultValue={state?.fields?.email}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 pr-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg mt-2"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* OAuth Button */}
          <Button
            variant="outline"
            type="button"
            disabled={isSocialLoginPending}
            onClick={() => handleSocialLogin("google")}
            className="w-full bg-transparent border-input text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg"
          >
            {isSocialLoginPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GitBranch className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
        </CardContent>

        {/* Footer Link */}
        <CardFooter className="px-6 pb-6 pt-0 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
