"use client";

import {
  useState,
  useOptimistic,
  useTransition,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  Undo2,
} from "lucide-react";
import { type PostComment } from "../queries";
import { writeCommentAction } from "../actions";
import { toast } from "sonner";
import { PostTimestamp } from "./PostTimestamp";

export type CommentWithReplies = PostComment & {
  replies?: CommentWithReplies[];
};

// Helper: Converts flat comments array into a hierarchical tree (Infinite Nesting)
function buildCommentTree(comments: PostComment[] = []): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>();
  const roots: CommentWithReplies[] = [];

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

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

// Helper: Recursively count all nested descendant replies for a comment node
function countTotalReplies(comment: CommentWithReplies): number {
  if (!comment.replies || comment.replies.length === 0) return 0;
  return comment.replies.reduce(
    (acc, reply) => acc + 1 + countTotalReplies(reply),
    0,
  );
}

export default function CommentSection({
  initialComments = [],
  userId,
  postId,
  userImage,
}: {
  initialComments: PostComment[];
  userId: string | null;
  postId: string;
  userImage: string | null;
}) {
  const [newComment, setNewComment] = useState("");
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state management for comments
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, newCommentItem: PostComment) => [newCommentItem, ...state],
  );

  const commentTree = buildCommentTree(optimisticComments);

  const currentUserAvatar =
    userImage ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  const handleWriteComment = async () => {
    const trimmedContent = newComment.trim();
    if (!trimmedContent) return;

    // Reset input immediately
    setNewComment("");

    startTransition(async () => {
      // 1. Instantly inject optimistic comment entry
      addOptimisticComment({
        id: `temp-${Date.now()}`,
        content: trimmedContent,
        postId,
        authorId: userId || "current-user",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: userId || "current-user",
          name: "You",
          email: "",
          emailVerified: false,
          role: "USER",
          image: userImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // 2. Dispatch Server Action
      const res = await writeCommentAction({
        content: trimmedContent,
        postId,
      });

      if (res?.success) {
        toast.success(res?.message || "Comment added!");
      } else {
        toast.error(res?.message || "Failed to post comment.");
      }
    });
  };

  return (
    <section
      id="comments"
      className="bg-card text-card-foreground border border-border rounded-2xl p-4 sm:p-8 flex flex-col gap-6 max-w-full overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          Discussion ({optimisticComments.length})
        </h2>
      </div>

      {/* Write Main Comment Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleWriteComment();
        }}
        className="flex gap-3 items-start"
      >
        <Image
          width={36}
          height={36}
          src={currentUserAvatar}
          alt="Current User"
          className="w-9 h-9 rounded-full object-cover border border-border bg-muted flex-shrink-0 mt-1"
        />

        <div className="flex-1 relative group">
          <textarea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion..."
            disabled={isPending}
            className="w-full bg-background border border-border rounded-xl p-3 pb-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none disabled:opacity-60"
          />

          <div className="absolute right-2.5 bottom-3.5">
            <button
              type="submit"
              disabled={!newComment.trim() || isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:hover:bg-primary text-xs font-semibold rounded-lg transition-all shadow-sm"
            >
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comment List Wrapper with Horizontal Scroll */}
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex flex-col gap-6 min-w-full w-max">
          {commentTree.length > 0 ? (
            commentTree.map((comment) => (
              <CommentItem
                userImage={userImage}
                key={comment.id}
                comment={comment}
                postId={postId}
                userId={userId}
                onAddOptimisticComment={addOptimisticComment}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No comments yet. Be the first to start the discussion!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// --- Sub-Component: Card-Style Comment Item ---
function CommentItem({
  userImage,
  comment,
  postId,
  userId,
  onAddOptimisticComment,
}: {
  userImage: string | null;
  comment: CommentWithReplies;
  postId: string;
  userId: string | null;
  onAddOptimisticComment: (comment: PostComment) => void;
}) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [isPending, startTransition] = useTransition();

  const replyBoxRef = useRef<HTMLFormElement>(null);

  const authorName = comment.author?.name || "Anonymous";
  const authorAvatar =
    comment.author?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  // Calculates total recursive sub-tree replies count
  const totalRepliesCount = countTotalReplies(comment);

  // Auto-scroll horizontally when clicking reply on a deeply nested comment
  useEffect(() => {
    if (showReplyBox && replyBoxRef.current) {
      replyBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }, [showReplyBox]);

  const handleWriteReply = async () => {
    const trimmedReply = replyContent.trim();
    if (!trimmedReply) return;

    setReplyContent("");
    setShowReplyBox(false);
    setShowReplies(true);

    startTransition(async () => {
      onAddOptimisticComment({
        id: `temp-${Date.now()}`,
        content: trimmedReply,
        postId,
        authorId: userId || "current-user",
        parentId: comment.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: userId || "current-user",
          name: "You",
          email: "",
          emailVerified: false,
          role: "USER",
          image: userImage,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const res = await writeCommentAction({
        parentId: comment.id,
        content: trimmedReply,
        postId,
      });

      if (res?.success) {
        toast.success(res?.message || "Reply added!");
      } else {
        toast.error(res?.message || "Failed to post reply.");
      }
    });
  };

  return (
    <div className="flex gap-3 text-xs sm:text-sm min-w-[280px] sm:min-w-[320px]">
      {/* Avatar */}
      <Image
        width={32}
        height={32}
        src={authorAvatar}
        alt={authorName}
        className="w-8 h-8 rounded-full object-cover border border-border bg-muted flex-shrink-0 mt-0.5"
      />

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Comment Card Body */}
        <div className="bg-background border border-border rounded-2xl p-3.5 flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">
                {authorName}
              </span>
              <span className="text-[11px] text-muted-foreground">
                • <PostTimestamp createdAt={comment.createdAt} />
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
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
                <span>Cancel</span>
              </>
            ) : (
              <>
                <CornerDownRight className="w-3.5 h-3.5" />
                <span>Reply</span>
              </>
            )}
          </button>

          {/* Toggle replies button showing total descendant counts */}
          {totalRepliesCount > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 hover:text-foreground transition-colors font-medium ml-auto"
            >
              <span>
                {showReplies
                  ? "Hide replies"
                  : `View ${totalRepliesCount} ${totalRepliesCount === 1 ? "reply" : "replies"}`}
              </span>
              {showReplies ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Reply Input Box */}
        {showReplyBox && (
          <form
            ref={replyBoxRef}
            onSubmit={(e) => {
              e.preventDefault();
              handleWriteReply();
            }}
            className="pt-1 flex gap-2 w-full max-w-sm"
          >
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to @${authorName.toLowerCase().replace(/\s+/g, "")}...`}
              disabled={isPending}
              autoFocus
              className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60 min-w-[200px]"
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || isPending}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 transition-all inline-flex items-center gap-1 flex-shrink-0"
            >
              {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Reply</span>
            </button>
          </form>
        )}

        {/* Infinite Nested Comments - Left indentation is always applied */}
        {totalRepliesCount > 0 && showReplies && (
          <div className="flex flex-col gap-3 pt-2 pl-3 sm:pl-5 border-l border-border ml-1 sm:ml-2">
            {comment.replies?.map((reply) => (
              <CommentItem
                key={reply.id}
                userImage={userImage}
                comment={reply}
                postId={postId}
                userId={userId}
                onAddOptimisticComment={onAddOptimisticComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
