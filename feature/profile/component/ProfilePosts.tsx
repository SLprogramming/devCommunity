import Link from "next/link";
import { FileText } from "lucide-react";
import { getSession } from "@/lib/get-session";
import { getProfilePosts } from "@/feature/post/queries";
import PostCard from "@/feature/post/component/PostData";

export default async function ProfilePosts({ userId }: { userId: string }) {
  const session = await getSession();
  const isOwner = session?.user?.id === userId;

  const posts = await getProfilePosts(userId, session?.user?.id);

  if (posts.length === 0) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl py-14 flex flex-col items-center justify-center gap-3 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <FileText className="w-5 h-5 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-medium text-foreground">
          {isOwner ? "No posts yet" : "No published posts yet"}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
          {isOwner
            ? "Share your first post and it will show up on your profile."
            : `${"They haven't published anything yet."}`}
        </p>
        {isOwner && (
          <Link
            href="/post/create"
            className="mt-1 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Create a post
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 min-w-0 w-full">
      {posts.map((post, index) => (
        <div
          key={post.id}
          className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl transition-colors hover:border-muted-foreground/30"
        >
          <div className="px-4 sm:px-6">
            <PostCard post={post} priority={index === 0} />
          </div>
        </div>
      ))}
    </div>
  );
}
