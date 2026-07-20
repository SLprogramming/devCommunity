import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./email";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.create({
            data: {
              userId: user.id,
            },
          });
        },
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Implement your email sending logic here
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `<p>Please verify your email by clicking the following link: <a href="${url}">${url}</a></p>`,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expireIn: 60 * 60, // 1 hour in seconds
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(
        `Send password reset email to ${user.email} with token: ${token}`,
      );
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires soon.</p>`,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else if (type === "forget-password") {
          // Send the OTP for password reset
          await sendEmail({
            to: email,
            subject: "Your Password Reset OTP",
            html: `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff; color: #18181b;">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #09090b;">Reset your password</h2>
      <p style="font-size: 14px; color: #71717a; line-height: 1.5; margin-bottom: 24px;">
        We received a request to reset your developer account password. Use the verification code below to proceed.
      </p>
      
      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 4px; padding: 12px 24px; background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; color: #18181b;">
          ${otp}
        </div>
      </div>
      
      <p style="font-size: 12px; color: #a1a1aa; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f4f4f5; pt: 16px;">
        This code expires shortly. If you did not make this request, you can safely ignore this email.
      </p>
    </div>
  `,
          });
        }
      },
      sendVerificationOnSignUp: false,
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
