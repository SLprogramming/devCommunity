import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostTimestamp } from "./PostTimestamp";
import { PostFooter } from "./PostFooter";
import type { FeedPost } from "../feed";

// Compute footer counts directly from included relations (reactions/comments/shares)
function getFooterData(post: FeedPost) {
  return {
    postId: post.id,
    reactions: post.reactions.map((reaction) => ({
      type: reaction.type,
      userId: reaction.userId,
    })),
    comments: post.comments.reduce(
      (total, comment) => total + 1 + comment.replies.length,
      0,
    ),
    share: post.shares.length,
    views: post.views,
  };
}

export default function PostCard({
  post,
  priority = false,
}: {
  post: FeedPost;
  priority?: boolean;
}) {
  return (
    <article
      className="w-full text-card-foreground py-5 sm:py-6 group min-w-0"
    >
      <Link
        href={`/profile/${post?.author?.id}`}
        className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 min-w-0"
      >
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border shrink-0">
          <AvatarImage
            src={post?.author?.image || undefined}
            alt="User avatar"
          />
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {post.author?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-medium text-foreground/90 hover:text-primary transition-colors truncate">
            {post.author?.name || "Anonymous"}
          </h4>
          <p className="text-[11px] sm:text-xs text-muted-foreground truncate flex items-center gap-2">
            <PostTimestamp createdAt={post.createdAt} />
            {!post.published && (
              <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                Draft
              </span>
            )}
          </p>
        </div>
      </Link>

      <Link href={`/post/${post.id}`} className="block min-w-0">
        <h2 className="text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug break-words">
          {(() => {
            const text = post?.caption || post?.content;
            return text && text.length > 500
              ? `${text.slice(0, 500)}...`
              : text;
          })()}
        </h2>

        {/* Optional Post Image */}
        {post.imageUrl && (
          <div className="relative mb-4 h-72 sm:h-96 w-full overflow-hidden rounded-lg sm:rounded-xl border border-border bg-muted/30">
            <Image
              fill
              priority={priority} // Prioritize the first post's image for faster loading
              src={post.imageUrl}
              alt={post.caption || "Post image"}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              sizes="(max-width: 640px) 100vw, 512px"
            />
          </div>
        )}
      </Link>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        {post.hashtags.map((tag) => (
          <span
            key={tag.id}
            className="text-[11px] sm:text-xs font-mono bg-muted/60 text-muted-foreground px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-border hover:border-muted-foreground/40 hover:text-foreground transition-colors"
          >
            #{tag.name}
          </span>
        ))}
      </div>

      <PostFooter initialData={getFooterData(post)} />
    </article>
  );
}

function PostSkeleton() {
  return (
    <article className="w-full text-card-foreground py-5 sm:py-6 animate-pulse min-w-0">
      {/* 1. Author Header Skeleton */}
      <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 min-w-0">
        {/* Avatar */}
        <div className="h-8 w-8 rounded-lg bg-muted border border-border shrink-0" />

        {/* Name & Timestamp */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="h-4 w-28 bg-muted rounded-md" />
          <div className="h-3 w-16 bg-muted/70 rounded-md" />
        </div>
      </div>

      {/* 2. Caption Skeleton */}
      <div className="space-y-2 mb-3">
        <div className="h-5 sm:h-6 w-5/6 bg-muted rounded-md" />
        <div className="h-5 sm:h-6 w-3/4 bg-muted rounded-md" />
      </div>

      {/* 3. Image Skeleton */}
      <div className="mb-4 h-48 sm:h-64 w-full rounded-lg sm:rounded-xl border border-border bg-muted/50" />

      {/* 4. Hashtags Skeleton */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        <div className="h-5 sm:h-6 w-14 sm:w-16 bg-muted/60 rounded-md border border-border" />
        <div className="h-5 sm:h-6 w-16 sm:w-20 bg-muted/60 rounded-md border border-border" />
        <div className="h-5 sm:h-6 w-12 sm:w-14 bg-muted/60 rounded-md border border-border" />
      </div>

      {/* 5. Footer Actions Skeleton */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3.5 sm:pt-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
          {/* Reaction Button */}
          <div className="h-4 sm:h-5 w-14 sm:w-16 bg-muted rounded-md shrink-0" />
          {/* Comments Button */}
          <div className="h-4 sm:h-5 w-10 sm:w-12 bg-muted rounded-md shrink-0" />
          {/* Share Button */}
          <div className="h-4 sm:h-5 w-12 sm:w-14 bg-muted rounded-md shrink-0" />
        </div>

        {/* Views Counter */}
        <div className="h-3.5 sm:h-4 w-8 sm:w-10 bg-muted/80 rounded-md shrink-0" />
      </div>
    </article>
  );
}

// Convenient Feed Skeleton List
export function PostFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="w-full max-w-3xl divide-y divide-border min-w-0">
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
