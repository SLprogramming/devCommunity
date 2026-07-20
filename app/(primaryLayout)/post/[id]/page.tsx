"use cache";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import CommentSection from "@/feature/post/component/PostCommentSection";
import { getPopularPostIds, getPostDetailWithId } from "@/feature/post/queries";
import { notFound } from "next/navigation";
import { getReadingTime } from "@/utils/helper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const postIds = await getPopularPostIds();
  return postIds.map((id) => ({
    id,
  }));
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();
  const postDetail = await getPostDetailWithId(id);
  if (!postDetail) return notFound();
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= MAIN ARTICLE AREA ================= */}
        <main className="lg:col-span-9 flex flex-col gap-6">
          <article className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Header Banner Image */}
            {postDetail?.imageUrl && (
              <div className="h-60 sm:h-80 w-full relative bg-muted border-b border-border/40">
                <Image
                  fill
                  src={postDetail.imageUrl}
                  alt={postDetail.caption || "Post Banner"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Author & Meta Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    width={44}
                    height={44}
                    src={
                      postDetail?.author?.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    }
                    alt={postDetail?.author?.name || "Author Avatar"}
                    className="w-11 h-11 rounded-2xl object-cover border border-border bg-muted flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm leading-tight truncate">
                      {postDetail?.author?.name || "Anonymous"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {postDetail?.createdAt
                          ? new Date(postDetail.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "Recently"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {getReadingTime(
                          postDetail?.caption || postDetail?.content || "",
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-3.5 py-1.5 rounded-xl transition-colors">
                  Follow
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                {postDetail?.caption}
              </h1>

              {/* Tags Stack */}
              <div className="flex flex-wrap gap-1.5">
                {postDetail?.hashtags.map((tag) => (
                  <span
                    key={tag?.id}
                    className="text-xs bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-lg hover:border-primary/40 cursor-pointer transition-all"
                  >
                    #{tag?.name}
                  </span>
                ))}
              </div>

              {/* Body Content */}
              <div className="text-sm sm:text-base text-foreground/90 space-y-4 leading-relaxed">
                <p>
                  {postDetail?.content}
                  {/* When handling many-to-many relationships like tags in Prisma,
                  developers often reach for connectOrCreate
                  <code className="bg-muted border border-border px-1.5 py-0.5 rounded text-xs font-mono text-primary">
                    connectOrCreate
                  </code>
                  . While elegant, executing nested writes over large arrays
                  creates a severe N+1 query bottleneck. */}
                </p>

                {/* <div className="p-4 border-l-4 border-primary bg-muted/40 rounded-r-xl my-4 text-xs sm:text-sm">
                  <p className="font-semibold text-foreground">
                    ⚡ Key Takeaway:
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Always separate bulk tag existence checks from relation
                    connections using native atomic DB operations like{" "}
                    <code className="text-primary font-mono">
                      skipDuplicates
                    </code>
                    .
                  </p>
                </div> */}

                {/* <p>
                  Here is how you reduce 20+ sequential roundtrips down to just
                  3 clean, race-condition safe queries...
                </p> */}
              </div>
            </div>
          </article>
          <CommentSection />
        </main>

        {/* ================= RIGHT SIDEBAR: AUTHOR CARD ================= */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-6">
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                width={48}
                height={48}
                src={
                  postDetail?.author?.image ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                }
                alt={postDetail?.author?.name || "Author Avatar"}
                className="w-12 h-12 rounded-2xl object-cover border border-border bg-muted flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-foreground text-sm leading-tight truncate">
                  {postDetail?.author?.name || "Anonymous Author"}
                </h4>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {postDetail?.author?.email || "@author"}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {postDetail?.author?.profile?.bio ||
                "Full-stack engineer passionate about backend architecture, Node.js performance tuning, and high-concurrency systems."}
            </p>

            <Link
              href={`/profile/${postDetail?.author?.id || "anonymous"}`}
              className="w-full text-center py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-xs font-semibold rounded-xl transition-colors"
            >
              View Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
