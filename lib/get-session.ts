// lib/get-session.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

// React `cache` deduplicates this call within a single request render tree
export const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});
