"use client";

import { useEffect, useState } from "react";

interface PostTimestampProps {
  createdAt?: Date | string | null;
}

export function PostTimestamp({ createdAt }: PostTimestampProps) {
  const [formattedTime, setFormattedTime] = useState<string>("");

  useEffect(() => {
    if (!createdAt) {
      setFormattedTime("Recently");
      return;
    }

    const calculateTimeAgo = () => {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      // Handle future dates or exact match
      if (diffInSeconds < 59) {
        return "Just now";
      }

      const minutes = Math.floor(diffInSeconds / 60);
      const hours = Math.floor(diffInSeconds / 3600);
      const ONE_DAY_IN_HOURS = 24;

      // Under 1 hour
      if (minutes < 60) {
        return `${minutes}m ago`;
      }

      // Under 24 hours (1 day)
      if (hours < ONE_DAY_IN_HOURS) {
        return `${hours}h ago`;
      }

      // Longer than 1 day -> Standard Date
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    setFormattedTime(calculateTimeAgo());

    // // Optional: Refresh timestamp every minute for recent posts
    // const interval = setInterval(() => {
    //   setFormattedTime(calculateTimeAgo());
    // }, 60000);

    // return () => clearInterval(interval);
  }, [createdAt]);

  // Prevents SSR hydration mismatch
  if (!formattedTime) {
    return <span className="text-muted-foreground animate-pulse">...</span>;
  }

  return <span>{formattedTime}</span>;
}
