"use client";

import { useCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";
import {
  followUserAction,
  getIsFollowingAction,
} from "@/feature/follow/actions";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";

interface ProfileButtonsProps {
  userId: string;
}

export default function ProfileButtons({ userId }: ProfileButtonsProps) {
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

  // Skeleton guard prevents layout shift on load
  if (isLoading || isUserLoading) {
    return (
      <div className="h-9 w-24 bg-muted animate-pulse rounded-xl mt-2 sm:mt-4 shrink-0" />
    );
  }

  return (
    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-4">
      {ownProfile ? (
        <>
          <Link
            href={`/profile/${user?.id}/manage`}
            className="flex-1 sm:flex-initial text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-3 sm:px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Manage Posts
          </Link>
          <Link
            href={`/profile/${user?.id}/edit`}
            className="flex-1 sm:flex-initial text-center text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-3 sm:px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            Edit Profile
          </Link>
        </>
      ) : (
        <button
          onClick={handleFollow}
          disabled={isPending}
          className={`w-full sm:w-auto text-center text-xs font-semibold border px-4 py-2 rounded-xl transition-colors shrink-0 ${
            isFollowing
              ? "bg-muted text-muted-foreground border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          }`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
