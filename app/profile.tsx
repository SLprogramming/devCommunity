import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connection } from "next/server";
async function Profile() {
  await connection();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return <div className="w-full max-w-md">{session?.user?.name}</div>;
}

export default Profile;
