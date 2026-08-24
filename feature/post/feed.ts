"use server";

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";

export type FeedTab = "discover" | "following" | "latest";

const PAGE_SIZE = 10;

// Shared relation shape so feed cards can compute counts without extra queries
const feedInclude = {
  author: true,
  hashtags: true,
  comments: {
    include: {
      replies: true,
    },
  },
  reactions: true,
  shares: true,
};

async function fetchFeedCached(
  tab: FeedTab,
  cursor: string | undefined,
  viewerId: string | undefined,
) {
  "use cache";

  // Per-user tag for the Following feed, shared tag for public feeds
  if (tab === "following") {
    cacheLife("minutes");
    cacheTag(`user-feed-${viewerId}`);
  } else {
    cacheLife("hours");
    cacheTag("posts");
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(tab === "following" &&
        viewerId && {
          author: {
            followers: {
              some: { followerId: viewerId },
            },
          },
        }),
    },
    include: feedInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasNextPage = posts.length > PAGE_SIZE;

  return {
    posts: hasNextPage ? posts.slice(0, PAGE_SIZE) : posts,
    nextCursor: hasNextPage ? posts[PAGE_SIZE - 1].id : null,
  };
}

export async function getFeedPostsAction(tab: FeedTab, cursor?: string) {
  try {
    const session = await getSession();

    // Only thread viewerId for the Following tab so public tabs share one cache entry
    const viewerId =
      tab === "following" ? (session?.user?.id ?? undefined) : undefined;

    return await fetchFeedCached(tab, cursor, viewerId);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return { posts: [], nextCursor: null };
  }
}

export type FeedPost = Awaited<
  ReturnType<typeof fetchFeedCached>
>["posts"][number];

export type FeedResult = Awaited<ReturnType<typeof fetchFeedCached>>;
