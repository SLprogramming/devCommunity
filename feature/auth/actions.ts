"use server";
import z from "zod";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
export type initialState = {
  message: string;
  success: boolean;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  fields?: {
    username?: string;
    email?: string;
  };
};

export const signUpAction = async (
  prevState: initialState,
  formData: FormData,
) => {
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
    };
  }
  try {
    let { username, email, password, confirmPassword } = parseData.data;
    let res = await auth.api.signUpEmail({
      body: {
        name: username,
        email,
        password,
      },
      asResponse: true,
    });
    console.log(res);

    console.log(
      "from signup action:",
      username,
      email,
      password,
      confirmPassword,
    );
    return {
      message: "please check your email for verification",
      success: true,
    };
  } catch (error) {
    console.error("Error during sign-up:", error);
    return {
      message: "An error occurred during sign-up",
      success: false,
    };
  }
};

export const signInAction = async (
  prevState: initialState,
  formData: FormData,
) => {
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
    } as initialState;
  }
  console.log(
    "from signin action:",
    parseData.data.email,
    parseData.data.password,
  );
  try {
    let { email, password } = parseData.data;
    console.log("from signin action:", email, password);
    let res = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });
    console.log(res);
    if (!res.ok) {
      return {
        message: "Sign-in failed",
        success: false,
      };
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    return {
      message: "An error occurred during sign-in",
      success: false,
    };
  }
  redirect("/");
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
