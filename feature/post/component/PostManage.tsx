"use client";

import React, { useState, useTransition, useOptimistic } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Sparkles,
  Calendar,
  Loader2,
  Globe,
  GlobeOff,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UserPost } from "@/feature/post/queries";
import { PostTimestamp } from "@/feature/post/component/PostTimestamp";
import {
  deletePostAction,
  togglePublishPostAction,
} from "@/feature/post/actions";
import { toast } from "sonner";

type SortKey = "date-desc" | "date-asc" | "popular-desc" | "popular-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "popular-desc", label: "Most popular" },
  { value: "popular-asc", label: "Least popular" },
];

export default function PostManage({ postArray }: { postArray: UserPost[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [sortKey, setSortKey] = useState<SortKey>("date-desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // 1. Pass `postArray` prop DIRECTLY to useOptimistic (No useState required!)
  const [optimisticPosts, setOptimisticPosts] = useOptimistic(
    postArray,
    (
      currentPosts,
      action:
        | { type: "delete"; id: string }
        | { type: "togglePublish"; id: string },
    ) => {
      if (action.type === "delete") {
        return currentPosts.filter((p) => p.id !== action.id);
      }
      if (action.type === "togglePublish") {
        return currentPosts.map((p) =>
          p.id === action.id ? { ...p, published: !p.published } : p,
        );
      }
      return currentPosts;
    },
  );

  // 2. Filter logic on Optimistic Posts
  const filteredPosts = optimisticPosts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      (post?.caption?.toLowerCase().includes(query) ?? false) ||
      (post?.content?.toLowerCase().includes(query) ?? false);

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "published"
          ? Boolean(post.published)
          : !post.published;

    return matchesSearch && matchesStatus;
  });

  // 3. Sort logic on Filtered Posts
  const reactionCount = (post: UserPost) => post.reactions?.length || 0;

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortKey) {
      case "date-asc":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "popular-desc":
        return reactionCount(b) - reactionCount(a);
      case "popular-asc":
        return reactionCount(a) - reactionCount(b);
      case "date-desc":
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  // 3. Simple Handler: Trigger optimistic update -> Run Server Action
  const handleTogglePublish = (post: UserPost) => {
    startTransition(async () => {
      // Step A: Show change immediately on UI
      setOptimisticPosts({ type: "togglePublish", id: post.id });

      // Step B: Call Server Action (revalidateTag will update postArray prop)
      const res = await togglePublishPostAction({
        postId: post.id,
        published: !post.published,
      });

      if (res.toast) {
        toast(res.toast.message);
      }

      if (!res.success) {
        toast.error(res.message || "Failed to update publish status.");
      }
    });
  };

  // 4. Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    const targetId = deleteId;
    setDeleteId(null);

    startTransition(async () => {
      setOptimisticPosts({ type: "delete", id: targetId });

      const res = await deletePostAction({ postId: targetId });

      if (res.toast) {
        toast(res.toast.message);
      }

      if (!res.success) {
        toast.error(res.message || "Failed to delete post. Please try again.");
      }
    });
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
            Organize, publish, unpublish, or remove your articles and draft
            posts.
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Posts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {optimisticPosts.length}
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
              {optimisticPosts.filter((p) => p.published).length}
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
              {optimisticPosts.reduce(
                (acc, p) =>
                  acc + (p.reactions?.length || 0) + (p.comments?.length || 0),
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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

          {/* Arrange By */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Arrange by
            </span>
            <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
              <SelectTrigger
                size="sm"
                className="w-full sm:w-[150px] text-xs bg-muted/60 border-transparent shadow-none"
              >
                <SelectValue placeholder="Arrange by" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {SORT_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Posts List Container */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-xs relative">
        {sortedPosts.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
              >
                {/* Content Details */}
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-200 ${
                        post.published
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>

                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <PostTimestamp createdAt={post.createdAt} />
                    </span>
                  </div>

                  <Link
                    href={`/post/${post.id}`}
                    className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                  >
                    {post.caption || "Untitled Post"}
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                    {post.content || "No content available."}
                  </p>
                </div>

                {/* Analytics */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0 border-y md:border-none border-border/50 py-2 md:py-0">
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                    <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                    {post.reactions?.length || 0}
                  </span>
                  <span className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    {post.comments?.length || 0}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-1 shrink-0">
                  <Link
                    href={`/post/${post.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                    title="View post"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {/* Instant Toggle Button */}
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={isPending}
                    className={`p-2 rounded-xl transition-all active:scale-90 disabled:opacity-50 ${
                      post.published
                        ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-muted"
                    }`}
                    title={post.published ? "Unpublish post" : "Publish post"}
                  >
                    {post.published ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <GlobeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteId(post.id)}
                    disabled={isPending}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
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
          isDeleting={isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function DeleteModal({
  isDeleting,
  onConfirm,
  onCancel,
}: {
  isDeleting: boolean;
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
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
