import { Suspense } from "react";
import AuthGuard from "./authGuard";
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthGuard>{children}</AuthGuard>
      </Suspense>
    </div>
  );
}
