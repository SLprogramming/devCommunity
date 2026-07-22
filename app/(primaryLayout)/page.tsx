import PostsData, { PostFeedSkeleton } from "@/feature/post/component/PostData";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";

export default async function DevCommunityDashboard() {
  return (
    <>
      {/* Main Container */}

      {/* Left Sidebar Navigation */}

      {/* Main Feed */}
      <main className="md:col-span-2 flex flex-col gap-6">
        {/* Feed Filter Tabs */}
        <div className="flex gap-4 border-b border-border pb-2">
          <button className="text-sm font-semibold text-foreground border-b-2 border-primary pb-2 px-1">
            Discover
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
            Following
          </button>
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
            Latest
          </button>
        </div>
        <Suspense fallback={<PostFeedSkeleton />}>
          <InternalWarper />
        </Suspense>
      </main>
    </>
  );
}

async function InternalWarper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <>
      <PostsData userId={session?.user?.id || null} />
    </>
  );
}
