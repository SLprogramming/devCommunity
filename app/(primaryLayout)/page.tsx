import PostsData, { PostFeedSkeleton } from "@/feature/post/component/PostData";

export default async function DevCommunityDashboard() {
  return (
    <>
      {/* Main Feed */}
      <main className="md:col-span-2 flex flex-col gap-4 sm:gap-6 min-w-0 w-full">
        {/* Feed Filter Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-border pb-1 overflow-x-auto no-scrollbar">
          <button className="text-xs sm:text-sm font-semibold text-foreground border-b-2 border-primary pb-2 px-1 shrink-0">
            Discover
          </button>
          <button className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors shrink-0">
            Following
          </button>
          <button className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors shrink-0">
            Latest
          </button>
        </div>
        <PostsData />
      </main>
    </>
  );
}
