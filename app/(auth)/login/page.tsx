import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input"; // Adjust import path as needed
import Link from "next/link";
import GoogleSignButton from "../components/googleSignButton"; // Adjust import path as needed

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6 sm:p-10">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          {/* Card Header */}
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Welcome back
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Card Content & Form */}
          <div className="p-6 pt-0">
            <form action={undefined}>
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    {/* Email Field */}
                    <Field>
                      <FieldLabel htmlFor="login-email">
                        Email address
                      </FieldLabel>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                      />
                    </Field>

                    {/* Password Field */}
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="login-password">
                          Password
                        </FieldLabel>
                        <Link
                          href="#forgot-password"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Integrated Lucide Toggle Component */}
                      <PasswordInput
                        id="login-password"
                        name="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                      />
                    </Field>

                    {/* Remember Me Checkbox */}
                    <Field orientation="horizontal">
                      <Checkbox id="remember-me" name="remember-me" />
                      <FieldLabel htmlFor="remember-me" className="font-normal">
                        Remember me for 30 days
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {/* Primary Submit Button */}
                <Field className="pt-2">
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </Field>
              </FieldGroup>
            </form>

            {/* Visual Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Form */}
            <GoogleSignButton />

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
