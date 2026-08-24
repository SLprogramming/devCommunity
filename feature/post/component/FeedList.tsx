"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, UsersRound } from "lucide-react";
import {
  getFeedPostsAction,
  type FeedPost,
  type FeedTab,
} from "@/feature/post/feed";
import PostCard from "./PostData";

export default function FeedList({
  initialPosts,
  initialCursor,
  tab,
}: {
  initialPosts: FeedPost[];
  initialCursor: string | null;
  tab: FeedTab;
}) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isLoading, setIsLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!cursor || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const result = await getFeedPostsAction(tab, cursor);
      setPosts((prev) => [...prev, ...result.posts]);
      setCursor(result.nextCursor);
    } catch {
      // Keep cursor so the next intersection can retry
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [cursor, tab]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !cursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }, // Start loading before the sentinel is visible
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, loadMore]);

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center gap-3 w-full max-w-3xl">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          {tab === "following" ? (
            <UsersRound className="w-6 h-6 text-muted-foreground/60" />
          ) : (
            <Sparkles className="w-6 h-6 text-muted-foreground/60" />
          )}
        </div>
        <p className="text-sm font-medium text-foreground">
          {tab === "following" ? "Your feed is quiet" : "No posts yet"}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
          {tab === "following"
            ? "Posts from people you follow will show up here. Find interesting developers and follow them!"
            : "Be the first to share something with the community."}
        </p>
        {tab === "following" && (
          <Link
            href="/"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Discover posts instead
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-3xl divide-y divide-border min-w-0">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} priority={index === 0} />
        ))}
      </div>

      {/* Infinite scroll trigger / status */}
      <div
        ref={sentinelRef}
        className="flex items-center justify-center py-8 w-full max-w-3xl"
      >
        {isLoading ? (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more posts...
          </span>
        ) : cursor ? null : (
          <span className="text-xs text-muted-foreground">
            You&apos;re all caught up 🎉
          </span>
        )}
      </div>
    </>
  );
}
