"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Send,
  CornerDownRight,
  Undo2,
} from "lucide-react";
import { type PostComment } from "../queries";
import { writeCommentAction } from "../actions";
import { toast } from "sonner";
import { PostTimestamp } from "./PostTimestamp";

// Helper type to support recursive rendering of nested replies
export type CommentWithReplies = PostComment & {
  replies?: CommentWithReplies[];
};

// Formats Prisma Date object into a readable string
function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Converts flat Prisma comments array into a hierarchical tree structure
function buildCommentTree(comments: PostComment[] = []): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  // Step 1: Initialize map entries with an empty replies array
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Step 2: Attach children to parent comments or push to roots
  comments.forEach((comment) => {
    const mappedComment = commentMap.get(comment.id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      commentMap.get(comment.parentId)!.replies?.push(mappedComment);
    } else {
      roots.push(mappedComment);
    }
  });

  return roots;
}

export default function CommentSection({
  initialComments = [],
  userId,
  postId,
}: {
  initialComments: PostComment[];
  userId: string | null;
  postId: string;
}) {
  const [newComment, setNewComment] = useState("");
  const commentTree = buildCommentTree(initialComments);

  const handleWriteComment = async () => {
    try {
      let res = await writeCommentAction({
        content: newComment,
        postId: postId,
      });
      if (res?.message) {
        toast.success(res?.message);
      }
    } catch (error) {}
  };

  return (
    <section
      id="comments"
      className="bg-card text-card-foreground border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Discussion ({initialComments.length})
        </h2>
      </div>

      {/* Write Comment Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex gap-3 items-start"
      >
        <Image
          width={36}
          height={36}
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
          alt="Current User"
          className="w-9 h-9 rounded-full object-cover border border-border bg-muted flex-shrink-0 mt-1"
        />

        <div className="flex-1 relative group">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion..."
            className="w-full bg-background border border-border rounded-xl p-3 pb-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
          />

          <div className="absolute right-2.5 bottom-3.5">
            <button
              type="submit"
              onClick={handleWriteComment}
              disabled={!newComment.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-6">
        {commentTree.length > 0 ? (
          commentTree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-xs text-muted-foreground py-4 text-center">
            No comments yet. Be the first to start the discussion!
          </p>
        )}
      </div>
    </section>
  );
}

// --- Sub-Component: Recursive Comment Item ---
function CommentItem({ comment }: { comment: CommentWithReplies }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [newComment, setNewComment] = useState("");

  const authorName = comment.author?.name || "Anonymous";
  const authorAvatar =
    comment.author?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  const handleWriteComment = async () => {
    try {
      let res = await writeCommentAction({
        parentId: comment?.id,
        content: newComment,
        postId: comment?.postId,
      });
      if (res?.message) {
        toast.success(res?.message);
      }
    } catch (error) {}
  };
  return (
    <div className="flex gap-3 text-xs sm:text-sm">
      <Image
        width={32}
        height={32}
        src={authorAvatar}
        alt={authorName}
        className="w-8 h-8 rounded-full object-cover border border-border bg-muted flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-background border border-border rounded-2xl p-3.5 flex flex-col gap-1.5">
          {/* Comment Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">
                {authorName}
              </span>
              <span className="text-[11px] text-muted-foreground">
                • {PostTimestamp({ createdAt: comment?.createdAt })}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Comment Body */}
          <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 px-1 text-xs text-muted-foreground">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
            }}
            className={`flex items-center gap-1.5 hover:text-destructive transition-colors ${
              isLiked ? "text-destructive font-semibold" : ""
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowReplyBox(!showReplyBox)}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            {showReplyBox ? (
              <>
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </>
            ) : (
              <>
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Reply</span>
              </>
            )}
          </button>
        </div>

        {/* Reply Input Trigger */}
        {showReplyBox && (
          <div className="pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Replying to @${authorName.toLowerCase().replace(/\s+/g, "")}...`}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleWriteComment}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Nested Comments (Recursive Render) */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="pl-3 sm:pl-5 border-l border-border flex flex-col gap-3 pt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
