"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client"; // Adjust path to your auth client

export function useCurrentUser() {
  const [isMounted, setIsMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = isMounted && session.data?.user ? session.data.user : null;

  return user;
}
