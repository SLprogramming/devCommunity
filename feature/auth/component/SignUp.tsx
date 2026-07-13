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
import { useActionState } from "react";
import { signUpAction, type initialState } from "@/feature/auth/actions";
import { FieldError } from "@/components/ui/field";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

import { useActionToast } from "@/hooks/use-action-toast";

export default function SignupForm() {
  const initialState: initialState = {
    message: "",
    success: false,
    fields: {
      username: "",
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
    signUpAction,
    initialState,
  );
  const [showPassword, setShowPassword] = React.useState<{
    password: boolean;
    comfirmPassword: boolean;
  }>({
    password: false,
    comfirmPassword: false,
  });
  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsSocialLoginPending(true);
    await signIn.social({
      provider,
      callbackURL: "/",
    });
    setIsSocialLoginPending(false);
  };
  useActionToast(state);
  React.useEffect(() => {
    return () => {
      React.startTransition(() => {
        formAction({ type: "RESET" });
      });
    };
  }, [formAction]);
  return (
    <div className="relative w-full max-w-md mx-auto group">
      {/* Dynamic background glow that adapts to light/dark modes */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-muted via-border to-muted rounded-2xl opacity-30 dark:opacity-50 blur-sm group-hover:opacity-70 transition duration-1000" />

      {/* Uses theme-aware semantic color variables */}
      <Card className="relative bg-card border-border text-card-foreground shadow-2xl rounded-2xl transition-colors duration-200">
        <CardHeader className="space-y-1.5 pt-6 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your details below to join the developer community
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          <form action={formAction} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <Input
                name="username"
                id="username"
                placeholder="codenerd"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                disabled={isPending}
                defaultValue={state.fields?.username}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              {state.errors?.username && (
                <FieldError>{state.errors?.username[0]}</FieldError>
              )}
            </div>

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
                disabled={isPending}
                defaultValue={state.fields?.email}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              {state.errors?.email && (
                <FieldError>{state.errors?.email[0]}</FieldError>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword.password ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isPending}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 pr-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      password: !showPassword.password,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword.password ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {state.errors?.password && (
                <FieldError>{state.errors?.password[0]}</FieldError>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword.comfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isPending}
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 pr-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      comfirmPassword: !showPassword.comfirmPassword,
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword.comfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {state.errors?.confirmPassword && (
                <FieldError>{state.errors?.confirmPassword[0]}</FieldError>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg mt-2"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sign Up with Email"
              )}
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={isSocialLoginPending}
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

        <CardFooter className="px-6 pb-6 pt-0 flex justify-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground font-medium hover:underline underline-offset-4 transition-all"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
