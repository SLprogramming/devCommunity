"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
export const logoutAction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};

export type initialMessage = {
  message: string;
  error?: {
    password?: string[];
    username?: string[];
    email?: string[];
    confirmPassword?: string[];
  };
};
export const signUpAction = async (
  prevState: initialMessage,
  formData: FormData,
) => {
  const formSchema = z
    .object({
      username: z.string().min(1, "Username is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Confirm Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
    });

  const result = formSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.log("Validation errors:", errors);
    return {
      message: "Validation failed",
      error: errors,
    };
  }
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  console.log("Form Data:", { username, email, password, confirmPassword });
  // auth.api.sendVerificationEmail({
  //   body: {
  //     email: "slprogramming.dev@gmail.com",
  //     callbackURL: "http://localhost:3000/login",
  //   },
  // });
  const signUpResponse = await auth.api.signUpEmail({
    body: {
      name: username,
      email,
      password,
    },
    // headers: await headers(),
  });
  console.log(signUpResponse);
  return { message: "Sign up successfully" };
};
