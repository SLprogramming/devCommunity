import { Suspense } from "react";
import Link from "next/link";
import { LogIn, UsersRound } from "lucide-react";
import { getSession } from "@/lib/get-session";
import { getFeedPostsAction, type FeedTab } from "@/feature/post/feed";
import { PostFeedSkeleton } from "@/feature/post/component/PostData";
import FeedList from "@/feature/post/component/FeedList";
import { PostCreateQueue } from "@/feature/post/component/PostCreateQueue";

function isValidTab(value: string | undefined): value is FeedTab {
  return value === "discover" || value === "following" || value === "latest";
}

async function FeedSection({ tab }: { tab: FeedTab }) {
  const { posts, nextCursor } = await getFeedPostsAction(tab);
  return (
    <FeedList initialPosts={posts} initialCursor={nextCursor} tab={tab} />
  );
}

export default async function DevCommunityDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const activeTab: FeedTab = isValidTab(tabParam) ? tabParam : "discover";

  const session = await getSession();
  const isLoggedOut = !session?.user?.id;
  const showLoginPrompt = activeTab === "following" && isLoggedOut;

  return (
    <>
      {/* Main Feed */}
      <main className="md:col-span-2 flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
        <PostCreateQueue />

        {showLoginPrompt ? (
          <div className="py-16 w-full max-w-3xl flex flex-col items-center justify-center gap-3 text-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <UsersRound className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Log in to see your Following feed
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
              Follow developers you find interesting and their posts will show
              up here.
            </p>
            <Link
              href="/login"
              className="mt-1 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              Log in
            </Link>
          </div>
        ) : (
          <Suspense key={activeTab} fallback={<PostFeedSkeleton />}>
            <FeedSection tab={activeTab} />
          </Suspense>
        )}
      </main>
    </>
  );
}
