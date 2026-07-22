import { cacheLife } from "next/cache";
import { getAllPosts } from "../queries";
import { PostCreateQueue } from "./PostCreateQueue";
import Link from "next/link";
import { PostTimestamp } from "./PostTimestamp";
import PostFooterWarper from "@/feature/post/component/PostFooterWarper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function PostsData({ userId }: { userId: string | null }) {
  "use cache";
  cacheLife("hours");
  // Mock data for the feed
  const posts = await getAllPosts();

  return (
    <>
      <PostCreateQueue />
      {/* Posts List */}
      {posts?.reverse().map((post) => (
        <article
          key={post.id}
          className="bg-card max-w-3xl text-card-foreground border border-border rounded-2xl p-6 hover:border-muted-foreground/30 transition-all hover:shadow-xl hover:shadow-black/5 group cursor-pointer"
        >
          <Link
            href={`/profile/${post?.author?.id}`}
            className="flex items-center gap-3 mb-4"
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage
                src={post?.author?.image || undefined}
                alt="User avatar"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {post?.author?.name || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors">
                {post.author?.name || "Anonymous"}
              </h4>
              <p className="text-xs text-muted-foreground">
                <PostTimestamp createdAt={post.createdAt} />
              </p>
            </div>
          </Link>
          <Link href={`/post/${post.id}`}>
            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
              {post?.caption}
            </h2>

            {/* Optional Post Image */}
            {post.imageUrl && (
              <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                <img
                  src={post.imageUrl}
                  alt={post.caption || "Post image"}
                  className="w-full max-h-96 object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
            )}
          </Link>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.hashtags.map((tag) => (
              <span
                key={tag.id}
                className="text-xs font-mono bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-md border border-border hover:border-muted-foreground/40 hover:text-foreground transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <PostFooterWarper postId={post.id} userId={userId} />
          {/* Card Footer Actions */}
        </article>
      ))}
    </>
  );
}

function PostSkeleton() {
  return (
    <article className="bg-card max-w-3xl text-card-foreground border border-border rounded-2xl p-6 animate-pulse">
      {/* 1. Author Header Skeleton */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-lg bg-muted border border-border shrink-0" />

        {/* Name & Timestamp */}
        <div className="space-y-1.5 flex-1">
          <div className="h-4 w-28 bg-muted rounded-md" />
          <div className="h-3 w-16 bg-muted/70 rounded-md" />
        </div>
      </div>

      {/* 2. Caption Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-6 w-5/6 bg-muted rounded-md" />
        <div className="h-6 w-3/4 bg-muted rounded-md" />
      </div>

      {/* 3. Image Skeleton */}
      <div className="mb-4 h-64 w-full rounded-xl border border-border bg-muted/50" />

      {/* 4. Hashtags Skeleton */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 w-16 bg-muted/60 rounded-md border border-border" />
        <div className="h-6 w-20 bg-muted/60 rounded-md border border-border" />
        <div className="h-6 w-14 bg-muted/60 rounded-md border border-border" />
      </div>

      {/* 5. Footer Actions Skeleton */}
      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center gap-4">
          {/* Reaction Button */}
          <div className="h-5 w-16 bg-muted rounded-md" />
          {/* Comments Button */}
          <div className="h-5 w-12 bg-muted rounded-md" />
          {/* Share Button */}
          <div className="h-5 w-14 bg-muted rounded-md" />
        </div>

        {/* Views Counter */}
        <div className="h-4 w-10 bg-muted/80 rounded-md" />
      </div>
    </article>
  );
}

// Convenient Feed Skeleton List
export function PostFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
