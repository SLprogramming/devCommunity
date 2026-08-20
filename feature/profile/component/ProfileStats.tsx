"use client";

import { formatCount } from "@/utils/helper";
import {
  FileText,
  Heart,
  MessageSquare,
  Bookmark,
  Calendar,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export type StatPost = {
  id: string;
  caption: string | null;
  content: string | null;
  createdAt: Date | string;
  reactionsCount: number;
  commentsCount: number;
};

export type StatComment = {
  id: string;
  content: string;
  postId: string;
  parentId: string | null;
  createdAt: Date | string;
};

interface ProfileStatsProps {
  stats: {
    postsCount: number;
    totalLikes: number;
    discussionsCount: number;
  };
  recentPosts: StatPost[];
  recentComments: StatComment[];
}

type TabType = "posts" | "comments" | "bookmarks";

const ProfileStats = ({
  stats: { postsCount, totalLikes, discussionsCount },
  recentPosts,
  recentComments,
}: ProfileStatsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const statItems = [
    { label: "Posts Created", value: postsCount, icon: FileText },
    { label: "Total Likes", value: totalLikes, icon: Heart },
    { label: "Discussions", value: discussionsCount, icon: MessageSquare },
  ];

  return (
    <div className="md:col-span-2 flex flex-col gap-4 sm:gap-6 min-w-0">
      {/* Stats Analytics Header Grid */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {statItems.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5 min-w-0"
            >
              <div className="flex items-center justify-between text-muted-foreground gap-1">
                <span className="text-[11px] sm:text-xs font-medium truncate hidden sm:inline">
                  {stat.label}
                </span>
                <span className="text-[11px] sm:text-xs font-medium truncate sm:hidden">
                  {stat.label.split(" ")[0]}
                </span>
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground/70 shrink-0" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-foreground tracking-tight truncate">
                {formatCount(stat.value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* User History/Activity Feed Filter Container */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-border pb-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("posts")}
            className={`text-xs sm:text-sm font-semibold pb-2 px-1 transition-colors relative shrink-0 ${
              activeTab === "posts"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent Posts
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`text-xs sm:text-sm font-semibold pb-2 px-1 transition-colors relative shrink-0 ${
              activeTab === "comments"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`text-xs sm:text-sm font-semibold pb-2 px-1 transition-colors relative shrink-0 ${
              activeTab === "bookmarks"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bookmarks
          </button>
        </div>

        {/* Tab Content: Recent Posts */}
        {activeTab === "posts" && (
          <div className="h-[320px] sm:h-[380px] overflow-y-auto pr-1 flex flex-col gap-2.5 sm:gap-3 scrollbar-thin scrollbar-thumb-muted">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="group bg-card hover:bg-accent/40 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col gap-2 shrink-0 min-w-0"
                >
                  {/* Post Title / Content snippet */}
                  <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                    {post.caption || post.content || "Untitled Post"}
                  </p>

                  {/* Post Metadata Footer */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground pt-1 gap-2 flex-wrap">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-muted-foreground/80" />
                        {post.reactionsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground/80" />
                        {post.commentsCount}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-muted-foreground/70 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No posts published yet"
                description="Articles published or shared contributions will populate directly into this pipeline feed."
              />
            )}
          </div>
        )}

        {/* Tab Content: Comments */}
        {activeTab === "comments" && (
          <div className="h-[320px] sm:h-[380px] overflow-y-auto pr-1 flex flex-col gap-2.5 sm:gap-3 scrollbar-thin scrollbar-thumb-muted">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <Link
                  key={comment.id}
                  href={`/post/${comment.postId}#comments`}
                  className="group bg-card hover:bg-accent/40 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col gap-2 shrink-0 min-w-0"
                >
                  {/* Context Tag Header */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground bg-muted/60 px-2 sm:px-2.5 py-0.5 rounded-md truncate">
                      <MessageSquare className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">
                        {comment.parentId
                          ? "Replied to comment"
                          : "Commented on post"}
                      </span>
                    </span>
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                    "{comment.content}"
                  </p>

                  {/* Comment Metadata Footer */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground pt-1 gap-2 flex-wrap">
                    <span className="text-[11px] sm:text-xs text-muted-foreground/70 group-hover:text-primary/80 transition-colors">
                      View discussion →
                    </span>

                    <span className="flex items-center gap-1 text-muted-foreground/70 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No recent comments"
                description="Your published comments and discussions will appear here."
              />
            )}
          </div>
        )}

        {/* Tab Content: Bookmarks Placeholder */}
        {activeTab === "bookmarks" && (
          <div className="h-[320px] sm:h-[380px] overflow-y-auto pr-1 flex flex-col gap-2.5 sm:gap-3 scrollbar-thin scrollbar-thumb-muted">
            <EmptyState
              title="No saved bookmarks"
              description="Posts you save for later reference will show up in this collection."
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Empty State Box
function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}

export default ProfileStats;
