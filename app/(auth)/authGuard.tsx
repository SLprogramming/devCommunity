import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If already logged in, send them away from the login/signup pages
  if (session) {
    redirect("/");
  }

  return <>{children}</>;
}
