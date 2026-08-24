"use client";

import { useEffect, useState, useTransition } from "react";
import {
  followUserAction,
  getIsFollowingAction,
} from "@/feature/follow/actions";
import { useCurrentUser } from "@/lib/get-current-user";
import { toast } from "sonner";

export default function FollowButton({ userId }: { userId: string }) {
  const user = useCurrentUser();
  const isUserLoading = user === undefined;
  const ownProfile = Boolean(user?.id && user.id === userId);

  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial follow state on mount
  useEffect(() => {
    if (isUserLoading) return;

    if (ownProfile) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    getIsFollowingAction(userId)
      .then((status) => {
        if (isMounted) setIsFollowing(status);
      })
      .catch((err) => {
        console.error("Failed to fetch follow status:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId, ownProfile, isUserLoading]);

  const handleFollow = () => {
    // Save current state for rollback
    const previousState = isFollowing;

    // 1. Immediately toggle local UI state (No flicker)
    setIsFollowing((prev) => !prev);

    startTransition(async () => {
      try {
        // 2. Call Server Action
        const result = await followUserAction(userId);

        if (result.success) {
          toast.success(result.message);
        } else {
          // Revert state if action failed
          setIsFollowing(previousState);
          toast.error(result.message || "Failed to update follow status");
        }
      } catch {
        // Revert on network/unexpected error
        setIsFollowing(previousState);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  // Hidden on own posts / until session resolves
  if (ownProfile || isUserLoading || isLoading) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`text-[11px] sm:text-xs font-semibold border px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl transition-colors shrink-0 disabled:opacity-50 ${
        isFollowing
          ? "bg-muted text-muted-foreground border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
