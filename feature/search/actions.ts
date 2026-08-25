"use server";

import {
  isValidSearchQuery,
  searchPosts,
  searchTags,
  searchUsers,
} from "./queries";

export type QuickSearchResult = Awaited<ReturnType<typeof quickSearchAction>>;

export async function quickSearchAction(q: string) {
  if (!isValidSearchQuery(q)) {
    return { posts: [], users: [], tags: [] };
  }

  try {
    const [posts, users, tags] = await Promise.all([
      searchPosts(q, 4),
      searchUsers(q, 3),
      searchTags(q, 4),
    ]);

    return { posts, users, tags };
  } catch (error) {
    console.error("Error in quick search:", error);
    return { posts: [], users: [], tags: [] };
  }
}
