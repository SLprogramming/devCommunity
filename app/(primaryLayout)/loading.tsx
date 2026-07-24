import { PostFeedSkeleton } from "@/feature/post/component/PostData";

export default function Loading() {
  return (
    <main className="md:col-span-2 flex flex-col gap-6 animate-pulse">
      {/* Feed Filter Tabs Skeleton */}
      <div className="flex gap-4 border-b border-border pb-2">
        <div className="h-5 w-16 bg-muted rounded" />
        <div className="h-5 w-16 bg-muted/60 rounded" />
        <div className="h-5 w-14 bg-muted/60 rounded" />
      </div>

      {/* Post List Skeleton Placeholder (if needed alongside PostsData's own skeleton) */}
      <PostFeedSkeleton />
    </main>
  );
}
