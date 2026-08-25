import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Hash,
  SearchX,
  User as UserIcon,
} from "lucide-react";
import { isValidSearchQuery, searchPosts, searchTags, searchUsers } from "@/feature/search/queries";
import SearchBar from "@/components/ui/search-bar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="md:col-span-2 flex flex-col gap-6 min-w-0 w-full">
      {/* Mobile search input (desktop uses the persistent top bar) */}
      <div className="md:hidden">
        <SearchBar initialQuery={q?.trim() ?? ""} autoFocus />
      </div>

      <header className="pt-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {isValidSearchQuery(q) ? (
            <>
              Results for <span className="text-primary">&ldquo;{q?.trim()}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          {isValidSearchQuery(q)
            ? "Posts, people, and tags matching your query."
            : "Find posts, creators, and tags across the community."}
        </p>
      </header>

      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults q={q} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ q }: { q?: string }) {
  if (!isValidSearchQuery(q)) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <SearchX className="w-6 h-6 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Type at least 2 characters
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
          Use the search bar above to look for posts, people, and tags.
        </p>
      </div>
    );
  }

  const term = q!.trim();
  const [posts, users, tags] = await Promise.all([
    searchPosts(term, 15),
    searchUsers(term, 10),
    searchTags(term, 12),
  ]);

  if (!posts.length && !users.length && !tags.length) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <SearchX className="w-6 h-6 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-foreground">No results found</p>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
          Nothing matched &ldquo;{term}&rdquo;. Try a different keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Posts */}
      {posts.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText className="w-4 h-4 text-primary" />
            Posts
            <span className="text-xs font-normal text-muted-foreground">
              ({posts.length})
            </span>
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block py-4 group min-w-0"
              >
                <p className="text-[11px] text-muted-foreground mb-1 truncate">
                  by {post.author?.name || "Anonymous"}
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                  {post.caption || post.content || "Untitled Post"}
                </h3>
                {post.content && post.caption && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 break-words">
                    {post.content}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-3">
                  <span>{post._count.reactions} reactions</span>
                  <span>{post._count.comments} comments</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* People */}
      {users.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserIcon className="w-4 h-4 text-primary" />
            People
            <span className="text-xs font-normal text-muted-foreground">
              ({users.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:bg-accent/40 transition-colors group min-w-0"
              >
                <Image
                  src={
                    user.image ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  }
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {user.name || "Anonymous"}
                  </p>
                  {user.profile?.jobTitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.profile.jobTitle}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Hash className="w-4 h-4 text-primary" />
            Tags
            <span className="text-xs font-normal text-muted-foreground">
              ({tags.length})
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.name}`}
                className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5 text-xs font-mono text-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                #{tag.name}
                <span className="text-[10px] text-muted-foreground font-sans">
                  {tag._count.posts}{" "}
                  {tag._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-4 w-24 bg-muted rounded-md" />
          <div className="h-16 w-full bg-muted rounded-xl" />
          <div className="h-16 w-full bg-muted rounded-xl" />
        </div>
      ))}
    </div>
  );
}
