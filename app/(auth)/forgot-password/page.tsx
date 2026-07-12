"use client";

import * as React from "react";
import { useActionState } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
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
import Link from "next/link";
import { forgotPasswordAction } from "@/feature/auth/actions";
import { FieldError } from "@/components/ui/field";

export default function ForgotPasswordPage() {
  // Mock action structure matching your style

  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction, // Replace with your real server action
    { success: false, message: "" },
  );

  return (
    <div className="relative w-full max-w-md mx-auto mt-[100px] group">
      {/* Dynamic background glow matching Login */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-muted via-border to-muted rounded-2xl opacity-30 dark:opacity-50 blur-sm group-hover:opacity-70 transition duration-1000" />

      {/* Main Card Container */}
      <Card className="relative bg-card border-border text-card-foreground shadow-2xl rounded-2xl transition-colors duration-200">
        <CardHeader className="space-y-1.5 pt-6 px-6">
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
            Reset password
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your email and we&apos;ll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {state?.success ? (
            /* Success Feedback Layout */
            <div className="flex flex-col items-center text-center space-y-3 py-4 animate-in fade-in duration-300">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <MailCheck className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Check your email
              </h3>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                {state.message ||
                  "We sent a password reset link to your email address."}
              </p>
            </div>
          ) : (
            /* Forgot Password Interactive Form */
            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email Address
                </label>
                <Input
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  required
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                />
              </div>

              {/* Error Message rendering if any */}
              {state?.message && !state.success && (
                <p className="text-xs font-medium text-destructive animate-in fade-in">
                  {state.message}
                </p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium rounded-lg mt-2"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>

        {/* Footer Back Link */}
        <CardFooter className="px-6 pb-6 pt-0 flex justify-center border-t border-border/50 mt-4 pt-4">
          <Link
            href="/login"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground font-medium transition-colors gap-1.5 group/link"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-x-0.5" />
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
