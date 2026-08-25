"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Users, UserCheck, MapPin, Layers, X } from "lucide-react";
import { toast } from "sonner";
import { followUserAction } from "@/feature/follow/actions";
import { formatCount } from "@/utils/helper";

interface NetworkUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  jobTitle?: string;
  address?: string;
  isFollowing: boolean;
  isSelf?: boolean;
}

export default function NetworkData({
  followers,
  following,
  isSelf,
}: {
  followers: NetworkUser[];
  following: NetworkUser[];
  isSelf: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [followState, setFollowState] = useState<Record<string, boolean>>({});

  const isUserFollowing = (user: NetworkUser) =>
    followState[user.id] ?? user.isFollowing;

  const handleFollowToggle = (userId: string) => {
    const previousState = isUserFollowing(
      currentList.find((u) => u.id === userId)!,
    );

    // 1. Immediately toggle local UI state (No flicker)
    setFollowState((prev) => ({ ...prev, [userId]: !previousState }));

    startTransition(async () => {
      try {
        // 2. Call Server Action
        const result = await followUserAction(userId);

        if (result.success) {
          toast.success(result.message);
        } else {
          // Revert state if action failed
          setFollowState((prev) => ({ ...prev, [userId]: previousState }));
          toast.error(result.message || "Failed to update follow status");
        }
      } catch {
        // Revert on network/unexpected error
        setFollowState((prev) => ({ ...prev, [userId]: previousState }));
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const currentList = activeTab === "followers" ? followers : following;

  const filteredUsers = currentList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full space-y-4">
      {/* Tabs Bar - Full Width Span */}
      <div className="flex border-b border-border gap-4 sm:gap-8 text-xs sm:text-sm font-medium pt-1">
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-3 flex items-center justify-center sm:justify-start gap-2 border-b-2 transition-colors relative flex-1 sm:flex-initial ${
            activeTab === "followers"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>Followers</span>
          <span className="text-[10px] sm:text-[11px] bg-muted/80 px-2 py-0.5 rounded-full text-muted-foreground">
            {formatCount(followers.length)}
          </span>
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab("following")}
            className={`pb-3 flex items-center justify-center sm:justify-start gap-2 border-b-2 transition-colors relative flex-1 sm:flex-initial ${
              activeTab === "following"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Following</span>
            <span className="text-[10px] sm:text-[11px] bg-muted/80 px-2 py-0.5 rounded-full text-muted-foreground">
              {formatCount(following.length)}
            </span>
          </button>
        )}
      </div>

      {/* Search Input - Full Width */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full bg-muted/30 border border-border/60 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Borderless List with Separators - Full Width */}
      <div className="divide-y divide-border/60 w-full">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item) => (
            <div
              key={item.id}
              className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-muted/20 px-2 transition-colors rounded-xl"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <Link href={`/profile/${item.id}`} className="shrink-0">
                  <Image
                    width={48}
                    height={48}
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={item.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-muted shrink-0"
                  />
                </Link>

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <Link
                      href={`/profile/${item.id}`}
                      className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors truncate"
                    >
                      {item.name}
                    </Link>

                    {/* Inline mobile follow button */}
                    {!item.isSelf && (
                      <button
                        onClick={() => handleFollowToggle(item.id)}
                        disabled={isPending}
                        className={`sm:hidden text-[11px] font-medium border px-2.5 py-1 rounded-full transition-colors shrink-0 ml-auto disabled:opacity-50 ${
                          isUserFollowing(item)
                            ? "bg-transparent text-muted-foreground border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                            : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        }`}
                      >
                        {isUserFollowing(item) ? "Unfollow" : "Follow"}
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {item.email}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-muted-foreground pt-0.5">
                    {item.jobTitle && (
                      <span className="flex items-center gap-1.5 truncate">
                        <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{item.jobTitle}</span>
                      </span>
                    )}
                    {item.address && (
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.address}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Action Button */}
              {!item.isSelf && (
                <button
                  onClick={() => handleFollowToggle(item.id)}
                  disabled={isPending}
                  className={`hidden sm:inline-flex text-xs font-medium border px-4 py-1.5 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
                    isUserFollowing(item)
                      ? "bg-transparent text-muted-foreground border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                  }`}
                >
                  {isUserFollowing(item) ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
            <Users className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              No {activeTab} found matching your query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
