import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-6 sm:p-10">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          {/* Card Header */}
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Create an account
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>

          {/* Card Content & Form */}
          <div className="p-6 pt-0">
            {/* Main Credentials Registration Form */}
            <form action={undefined}>
              {" "}
              {/* Replace undefined with your signup server action */}
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    {/* Username Field */}
                    <Field>
                      <FieldLabel htmlFor="signup-username">
                        Username
                      </FieldLabel>
                      <Input
                        id="signup-username"
                        name="username"
                        type="text"
                        placeholder="johndoe"
                        autoComplete="username"
                        required
                      />
                    </Field>

                    {/* Email Field */}
                    <Field>
                      <FieldLabel htmlFor="signup-email">
                        Email address
                      </FieldLabel>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                      />
                    </Field>

                    {/* Password Field */}
                    <Field>
                      <FieldLabel htmlFor="signup-password">
                        Password
                      </FieldLabel>
                      <PasswordInput
                        id="signup-password"
                        name="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </Field>

                    {/* Confirm Password Field */}
                    <Field>
                      <FieldLabel htmlFor="signup-confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <PasswordInput
                        id="signup-confirm-password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </Field>

                    {/* Terms & Conditions Checkbox */}
                    <Field orientation="horizontal">
                      <Checkbox id="terms" name="terms" required />
                      <FieldLabel
                        htmlFor="terms"
                        className="font-normal text-xs"
                      >
                        I accept the{" "}
                        <a
                          href="#terms"
                          className="text-primary hover:underline font-medium"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#privacy"
                          className="text-primary hover:underline font-medium"
                        >
                          Privacy Policy
                        </a>
                      </FieldLabel>
                    </Field>
                  </FieldGroup>
                </FieldSet>

                {/* Primary Sign Up Button */}
                <Field className="pt-2">
                  <Button type="submit" className="w-full">
                    Create Account
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
                  Or register with
                </span>
              </div>
            </div>

            {/* Google Registration Form */}
            <form action={undefined}>
              {" "}
              {/* Replace undefined with your google auth server action */}
              <Button type="submit" variant="outline" className="w-full gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </Button>
            </form>

            {/* Footer Navigation Link */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
