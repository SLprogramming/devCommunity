import { PostFeedSkeleton } from "@/feature/post/component/PostData";

export default function Loading() {
  return (
    <main className="md:col-span-2 flex flex-col gap-4 sm:gap-6 animate-pulse min-w-0 w-full">
      {/* Feed Filter Tabs Skeleton */}
      <div className="flex gap-2 sm:gap-4 border-b border-border pb-1 overflow-x-auto no-scrollbar">
        <div className="h-5 w-16 bg-muted rounded shrink-0" />
        <div className="h-5 w-16 bg-muted/60 rounded shrink-0" />
        <div className="h-5 w-14 bg-muted/60 rounded shrink-0" />
      </div>

      {/* Post List Skeleton Placeholder */}
      <PostFeedSkeleton />
    </main>
  );
}
