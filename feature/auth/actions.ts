"use server";
import z from "zod";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAPIError } from "better-auth/api";
import { ToastType } from "@/hooks/use-action-toast";

export type initialState = {
  message: string;
  success: boolean;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    otp?: string[];
  };
  fields?: {
    username?: string;
    email?: string;
  };
  toast?: ToastType;
  redirectTo?: string;
};

export const signUpAction = async (
  prevState: initialState,
  payload: FormData | { type: "RESET" },
): Promise<initialState> => {
  if (!(payload instanceof FormData) && payload?.type === "RESET") {
    return {
      success: false,
      message: "",
      toast: undefined, // Completely clear the stale toast data
    };
  }
  const formData = payload as FormData;
  const FormUserName = formData.get("username");
  const FormEmail = formData.get("email");
  const FormPassword = formData.get("password");
  const FormConfirmPassword = formData.get("confirmPassword");

  const formSchema = z
    .object({
      username: z
        .string()
        .min(3, {
          message: "username must be at least 3 characters",
        })
        .max(20, { message: "username must be at most 20 characters" }),
      email: z.string().email({
        message: "invalid email address",
      }),
      password: z.string().min(6, {
        message: "password must be at least 6 characters",
      }),
      confirmPassword: z.string().min(6, {
        message: "confirm password must be at least 6 characters",
      }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: "passwords do not match",
      path: ["confirmPassword"],
    });

  let parseData = formSchema.safeParse({
    username: FormUserName,
    email: FormEmail,
    password: FormPassword,
    confirmPassword: FormConfirmPassword,
  });

  if (parseData.error) {
    let errors = z.flattenError(parseData.error);
    console.log(errors.fieldErrors);
    return {
      message: "Validation failed",
      success: false,
      errors: errors.fieldErrors,
      fields: {
        username: FormUserName?.toString(),
        email: FormEmail?.toString(),
      },
      toast: {
        message: "Validation failed",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
  try {
    let { username, email, password, confirmPassword } = parseData.data;
    await auth.api.signUpEmail({
      body: {
        name: username,
        email,
        password,
      },
    });

    return {
      message: "Sign up success",
      success: true,
      toast: {
        message: "please check your email for verification",
        type: "success",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    return {
      message: "An error occurred during sign-up",
      success: false,
      toast: {
        message: isAPIError(error) ? error?.body?.message : "Sign up failed",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
};

export const signInAction = async (
  prevState: initialState,
  payload: FormData | { type: "RESET" },
): Promise<initialState> => {
  if (!(payload instanceof FormData) && payload?.type === "RESET") {
    return {
      success: false,
      message: "",
      toast: undefined, // Completely clear the stale toast data
    };
  }
  const formData = payload as FormData;
  const FormEmail = formData.get("email");
  const FormPassword = formData.get("password");

  const formSchema = z.object({
    email: z.string().email({
      message: "invalid email address",
    }),
    password: z.string().min(6, {
      message: "password must be at least 6 characters",
    }),
  });

  let parseData = formSchema.safeParse({
    email: FormEmail,
    password: FormPassword,
  });

  if (parseData.error) {
    let errors = z.flattenError(parseData.error);
    console.log(errors.fieldErrors);
    return {
      message: "Validation failed",
      success: false,
      errors: errors.fieldErrors,
      fields: {
        email: FormEmail?.toString(),
      },
      toast: {
        message: "validation failed",
        timestamp: Date.now(),
        type: "error",
      },
    };
  }

  try {
    let { email, password } = parseData.data;
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      message: "Signin Success",
      success: true,
      redirectTo: "/",
      toast: {
        message: "Login Success",
        type: "success",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    return {
      message: "An error occurred during sign-in",
      success: false,
      toast: {
        message: isAPIError(error) ? error?.body?.message : "sign in failed",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
};

export const signOutAction = async () => {
  try {
    let res = await auth.api.signOut({
      headers: await headers(),
      asResponse: true,
    });
    console.log("logout response:", res);
    if (!res.ok) {
      return {
        message: "Sign-out failed",
        success: false,
      };
    }
  } catch (error) {
    console.error("Error during sign-out:", error);
    return {
      message: "An error occurred during sign-out",
      success: false,
    };
  }
  redirect("/login");
};

export const forgotPasswordAction = async (
  prevState: initialState,
  payload: FormData | { type: "RESET" },
): Promise<initialState> => {
  if (!(payload instanceof FormData) && payload?.type === "RESET") {
    return {
      success: false,
      message: "",
      toast: undefined, // Completely clear the stale toast data
    };
  }
  const formData = payload as FormData;
  const FormEmail = formData.get("email");

  const formSchema = z.object({
    email: z.string().email({
      message: "invalid email address",
    }),
  });

  let parseData = formSchema.safeParse({
    email: FormEmail,
  });

  if (parseData.error) {
    let errors = z.flattenError(parseData.error);
    console.log(errors.fieldErrors);
    return {
      message: "Validation failed",
      success: false,
      errors: errors.fieldErrors,
      fields: {
        email: FormEmail?.toString(),
      },
      toast: {
        message: "Validation failed",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
  let { email } = parseData.data;
  try {
    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (!userExist) {
      return {
        message: "user with this email doesn't exist",
        success: false,
        errors: {
          email: ["user with this email doesn't exist "],
        },
      };
    }
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "forget-password",
      },
    });
    return {
      message: "otp sent successfully",
      success: true,
      redirectTo: `/verify-otp?email=${email}`,
      toast: {
        message: "OTP is sent to your email",
        type: "success",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error("Error during forgot password:", error);
    return {
      message: "An error occurred during forgot password",
      success: false,
      toast: {
        message: isAPIError(error)
          ? error?.body?.message
          : "An error occurred in sending OTP",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
};

export const resetPasswordAction = async (
  prevState: initialState,
  payload: FormData | { type: "RESET" },
): Promise<initialState> => {
  if (!(payload instanceof FormData) && payload?.type === "RESET") {
    return {
      success: false,
      message: "",
      toast: undefined, // Completely clear the stale toast data
    };
  }
  const formData = payload as FormData;
  const FormEmail = formData.get("email");
  const FormOtp = formData.get("otp");
  const FormPassword = formData.get("password");
  const FormConfirmPassword = formData.get("confirmPassword");
  const formSchema = z
    .object({
      otp: z.string(),
      email: z.string().email({
        message: "invalid Email address",
      }),
      password: z
        .string()
        .min(6, { message: "password must be at least 6 characters" }),
      confirmPassword: z
        .string()
        .min(6, { message: "confirm password be at least 6 characters" }),
    })
    .refine((data) => data.confirmPassword == data.password, {
      message: "passwords doesn't match",
      path: ["confirmPassword"],
    });
  const parseData = formSchema.safeParse({
    otp: FormOtp,
    email: FormEmail,
    password: FormPassword,
    confirmPassword: FormConfirmPassword,
  });

  if (!parseData.success) {
    let errors = z.flattenError(parseData.error);
    return {
      message: "validation failed",
      success: false,
      errors: errors.fieldErrors,
    };
  }
  let { email, password, otp } = parseData.data;
  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        otp,
        password,
      },
    });

    return {
      message: "password changed successfully",
      success: true,
      redirectTo: "/login",
      toast: {
        message: "Password changed successfully",
        type: "success",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      message: "failed on reset password",
      success: false,
      toast: {
        message: isAPIError(error)
          ? error?.body?.message
          : "Failed on reset password",
        type: "error",
        timestamp: Date.now(),
      },
    };
  }
};
