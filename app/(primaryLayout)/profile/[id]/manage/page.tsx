"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Sparkles,
  Calendar,
  Filter,
  ArrowUpDown,
} from "lucide-react";

// Types matching your database setup
export type ManagedPost = {
  id: string;
  title: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
};

// Mock data for demonstration
const INITIAL_POSTS: ManagedPost[] = [
  {
    id: "post_1",
    title:
      "Building scalable web applications with Next.js App Router and Prisma",
    excerpt:
      "Learn how to optimize queries, handle server actions, and manage cache effectively.",
    published: true,
    createdAt: "2026-07-15",
    likesCount: 24,
    commentsCount: 8,
  },
  {
    id: "post_2",
    title: "Mastering Tailwind CSS and Glassmorphism design trends",
    excerpt:
      "A deep dive into creating modern dark mode user interfaces with clean gradients.",
    published: true,
    createdAt: "2026-07-10",
    likesCount: 42,
    commentsCount: 15,
  },
  {
    id: "post_3",
    title: "Draft: Object-Oriented Programming principles in TypeScript",
    excerpt:
      "Exploring classes, encapsulation, and clean software architecture.",
    published: false,
    createdAt: "2026-07-02",
    likesCount: 0,
    commentsCount: 0,
  },
];

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<ManagedPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
          ? post.published
          : !post.published;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Manage Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize, edit, publish, or remove your articles and draft posts.
          </p>
        </div>

        <Link
          href="/post/create"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create New Post
        </Link>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Posts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {posts.length}
            </p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Published
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {posts.filter((p) => p.published).length}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Engagement
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {posts.reduce(
                (acc, p) => acc + p.likesCount + p.commentsCount,
                0,
              )}
            </p>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card border border-border rounded-2xl p-3 shadow-xs">
        {/* Search Bar */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 text-foreground placeholder:text-muted-foreground text-sm rounded-xl pl-9 pr-4 py-2 border border-transparent focus:border-primary/40 focus:bg-background focus:outline-none transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl w-full sm:w-auto">
          {(["all", "published", "draft"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 sm:flex-initial text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === tab
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table / Card List Container */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-xs">
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
              >
                {/* Left: Content Details */}
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>

                    {/* Date */}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <Link
                    href={`/post/${post.id}`}
                    className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Center: Analytics / Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 border-y md:border-none border-border/50 py-2 md:py-0">
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                    <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    {post.commentsCount}
                  </span>
                </div>

                {/* Right: Actions Menu */}
                <div className="flex items-center justify-end gap-1 shrink-0">
                  <Link
                    href={`/post/${post.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                    title="View post"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/post/${post.id}/edit`}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-xl transition-colors"
                    title="Edit post"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteId(post.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-xl transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No posts found
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
                {searchQuery
                  ? "Try searching for a different keyword or resetting your filter."
                  : "You haven't created any articles yet. Click below to start writing."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/post/create"
                className="mt-2 text-xs font-semibold text-primary hover:underline"
              >
                Create your first post →
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deleteId && (
        <DeleteModal
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// Simple Shadcn-Style Alert Confirmation Modal
function DeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border border-border rounded-2xl max-w-md w-full p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold text-foreground">
            Are you absolutely sure?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This action cannot be undone. This will permanently delete your
            published article and remove all associated likes and comments from
            our servers.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-xs transition-colors"
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );
}
