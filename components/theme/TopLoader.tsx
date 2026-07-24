"use client";

import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AppTopLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Light Mode Plum vs Dark Mode Violet
  const color = isDark ? "#c084fc" : "#601157";

  return <NextTopLoader color={color} showSpinner={false} height={3} />;
}
