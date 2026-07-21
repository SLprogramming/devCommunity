"use cache";
import React from "react";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/feature/post/queries";
import Link from "next/link";
import Image from "next/image";
import { PostTimestamp } from "@/feature/post/component/PostTimestamp";
import { PostCreateQueue } from "@/feature/post/component/CreatePostForm";

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
        <PostsData />
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-6">
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                width={48}
                height={48}
                src={
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                }
                alt={"Author Avatar"}
                className="w-12 h-12 rounded-2xl object-cover border border-border bg-muted flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-foreground text-sm leading-tight truncate">
                  {"Anonymous Author"}
                </h4>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {"@author"}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {
                "Full-stack engineer passionate about backend architecture, Node.js performance tuning, and high-concurrency systems."
              }
            </p>

            <Link
              href={`/profile/${"anonymous"}`}
              className="w-full text-center py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-xs font-semibold rounded-xl transition-colors"
            >
              View Profile
            </Link>
          </div>
        </aside>
      </main>
    </>
  );
}

async function PostsData() {
  cacheLife("hours");
  // Mock data for the feed
  const posts = await getAllPosts();

  return (
    <>
      <PostCreateQueue />
      {/* Posts List */}
      {posts?.reverse().map((post) => (
        <Link
          href={`/post/${post.id}`}
          key={post.id}
          className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-muted-foreground/30 transition-all hover:shadow-xl hover:shadow-black/5 group cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={post.author?.image || "/placeholder-avatar.png"}
              alt={post.author?.name || "Author photo"}
              className="h-8 w-8 rounded-lg object-cover border border-border"
            />
            <div>
              <h4 className="text-sm font-medium text-foreground/90 hover:text-primary transition-colors">
                {post.author?.name || "Anonymous"}
              </h4>
              <p className="text-xs text-muted-foreground">
                <PostTimestamp createdAt={post.createdAt} />
              </p>
            </div>
          </div>

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

          {/* Card Footer Actions */}
          <div className="flex items-center justify-between text-muted-foreground text-sm border-t border-border/50 pt-4">
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors group/btn">
                <ThumbsUp className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>20</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
                <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>12</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
              <Eye className="h-3.5 w-3.5" />
              <span>34</span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
