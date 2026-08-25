import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hash } from "lucide-react";
import { prisma } from "@/lib/prisma";
import PostCard from "@/feature/post/component/PostData";
import { formatCount } from "@/utils/helper";

async function getTagWithPosts(name: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`tag-${name}`);

  return prisma.hashtag.findUnique({
    where: { name },
    include: {
      posts: {
        where: { published: true },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        include: {
          author: true,
          hashtags: true,
          comments: {
            include: {
              replies: true,
            },
          },
          reactions: true,
          shares: true,
        },
      },
      _count: {
        select: {
          posts: { where: { published: true } },
        },
      },
    },
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name).replace(/^#/, "").toLowerCase();

  if (!decodedName) notFound();

  const tag = await getTagWithPosts(decodedName);
  if (!tag) notFound();

  return (
    <main className="md:col-span-2 flex flex-col gap-6 min-w-0 w-full">
      {/* Tag Header */}
      <header className="flex items-center gap-4 pt-1 pb-2 border-b border-border">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Hash className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight font-mono break-all">
            #{tag.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {formatCount(tag._count.posts)}{" "}
            {tag._count.posts === 1 ? "post" : "posts"}
          </p>
        </div>
      </header>

      {/* Posts */}
      {tag.posts.length > 0 ? (
        <div className="w-full max-w-3xl divide-y divide-border min-w-0">
          {tag.posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index === 0} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
          <Hash className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No posts yet</p>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
            No published posts carry this tag.{" "}
            <Link href="/" className="text-primary hover:underline">
              Explore the feed instead
            </Link>
          </p>
        </div>
      )}
    </main>
  );
}
