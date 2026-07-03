import LogoutButton from "@/components/logout-button";
import Profile from "./profile";
import { Suspense } from "react";

export default async function Home() {
  // If already logged in, send them away from the login/signup pages
  // if (!session) {
  //   redirect("/login");
  // }
  return (
    <div className="flex min-h-screen flex-col ">
      <Suspense fallback={<div className="w-full max-w-md">Loading...</div>}>
        <Profile />
      </Suspense>
      <div className="w-full max-w-md">hello world</div>
      <LogoutButton />
    </div>
  );
}
