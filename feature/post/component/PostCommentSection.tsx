"use client";
import { useState } from "react";
import Image from "next/image";

import {
  Heart,
  MessageSquare,
  MoreHorizontal,
  Send,
  CornerDownRight,
} from "lucide-react";

interface Comment {
  id: string;
  author: { name: string; avatar: string; handle: string };
  createdAt: string;
  content: string;
  likes: number;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: {
      name: "Alex Rivera",
      handle: "arivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    createdAt: "2 hours ago",
    content:
      "This two-step batching pattern saved our production DB from collapsing during a spike last month! Great breakdown on why Promise.all is dangerous for upserts.",
    likes: 12,
    replies: [
      {
        id: "1-1",
        author: {
          name: "Sarah Chen",
          handle: "schen_dev",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        },
        createdAt: "1 hour ago",
        content:
          "Completely agree! We hit Prisma pool exhaustion issues exact same way before switching to skipDuplicates.",
        likes: 4,
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "Marcus Vance",
      handle: "mvance",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    createdAt: "4 hours ago",
    content:
      "Awesome article! Does `createMany` with `skipDuplicates` work seamlessly across both PostgreSQL and MySQL in Prisma?",
    likes: 3,
  },
];

export default function CommentSection() {
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You (Current User)",
        handle: "dev_user",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      },
      createdAt: "Just now",
      content: newComment,
      likes: 0,
    };

    setComments([commentObj, ...comments]);
    setNewComment("");
  };
  return (
    <>
      {/* ================= COMMENT SECTION ================= */}
      <section
        id="comments"
        className="bg-card text-card-foreground border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Discussion ({comments.length})
          </h2>
        </div>

        {/* Write Comment Form */}
        <form onSubmit={handleAddComment} className="flex gap-3 items-start">
          <Image
            width={36}
            height={36}
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
            alt="Current User"
            className="w-9 h-9 rounded-xl object-cover border border-border bg-muted flex-shrink-0 mt-1"
          />

          {/* Relative Container wrapping Textarea and Floating Button */}
          <div className="flex-1 relative group">
            <textarea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add to the discussion..."
              className="w-full bg-background border border-border rounded-xl p-3 pb-12 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
            />

            {/* Floating Submit Button positioned inside bottom-right */}
            <div className="absolute right-2.5 bottom-3.5">
              <button
                type="submit"
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
        <div className="flex flex-col gap-6 pt-2">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
    </>
  );
}

// --- Sub-Component: Recursive Comment Item ---
function CommentItem({ comment }: { comment: Comment }) {
  const [likes, setLikes] = useState(comment.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="flex gap-3 text-xs sm:text-sm">
      <Image
        width={32}
        height={32}
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-8 h-8 rounded-xl object-cover border border-border bg-muted flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-background border border-border rounded-2xl p-3.5 flex flex-col gap-1.5">
          {/* Comment Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-xs">
                {comment.author.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                • {comment.createdAt}
              </span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Comment Body */}
          <p className="text-muted-foreground text-xs leading-relaxed">
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
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
        </div>

        {/* Reply Input Trigger */}
        {showReplyBox && (
          <div className="pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Replying to @${comment.author.handle}...`}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => setShowReplyBox(false)}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Nested Comments */}
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
