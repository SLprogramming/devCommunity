"use client";

import React, { useOptimistic, useTransition } from "react";
import {
  ThumbsUp,
  Heart,
  Laugh,
  ThumbsDown,
  MessageSquare,
  Eye,
  Share2,
} from "lucide-react";
import { reactPostAction } from "@/feature/post/actions";
import { type ReactionType as ImportReactionType } from "@/app/generated/prisma/enums";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCount } from "@/utils/helper";

type ReactionType = ImportReactionType | null;

interface ReactionOption {
  type: Exclude<ReactionType, null>;
  label: string;
  icon: React.ElementType;
  color: string;
  hoverBg: string;
}

const REACTIONS: ReactionOption[] = [
  {
    type: "LIKE",
    label: "Like",
    icon: ThumbsUp,
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-500/10",
  },
  {
    type: "LOVE",
    label: "Love",
    icon: Heart,
    color: "text-rose-500",
    hoverBg: "hover:bg-rose-500/10",
  },
  {
    type: "LAUGH",
    label: "Haha",
    icon: Laugh,
    color: "text-amber-500",
    hoverBg: "hover:bg-amber-500/10",
  },
  {
    type: "DISLIKE",
    label: "Dislike",
    icon: ThumbsDown,
    color: "text-slate-500",
    hoverBg: "hover:bg-slate-500/10",
  },
];

interface PostFooterProps {
  initialData: {
    userId?: string | null;
    postId: string;
    reactions?: ReactionType[];
    userReaction?: ReactionType;
    comments?: number;
    share?: number;
    views?: number;
  };
}

export function PostFooter({ initialData }: PostFooterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  console.log(initialData);
  // 1. Pass initialData directly into useOptimistic (no useState needed!)
  const [optimisticState, setOptimisticState] = useOptimistic(
    {
      userReaction: initialData?.userReaction || null,
      reactionCount: initialData?.reactions?.length || 0,
    },
    (current, nextReaction: ReactionType) => {
      const isRemoving =
        nextReaction === null || current.userReaction === nextReaction;
      const isAdding = current.userReaction === null && nextReaction !== null;

      let newCount = current.reactionCount;
      if (isRemoving) {
        newCount = Math.max(0, current.reactionCount - 1);
      } else if (isAdding) {
        newCount = current.reactionCount + 1;
      }

      return {
        userReaction: isRemoving ? null : nextReaction,
        reactionCount: newCount,
      };
    },
  );

  const handleSelectReaction = (type: ReactionType) => {
    if (!initialData?.userId) {
      return router.push("/login");
    }
    const targetReaction =
      type === null || optimisticState.userReaction === type ? null : type;

    startTransition(async () => {
      // 2. Immediately apply optimistic UI
      setOptimisticState(targetReaction);

      // 3. Call server action (Ensure reactPostAction calls revalidatePath on the server!)
      const res = await reactPostAction({
        postId: initialData.postId,
        reactionType: targetReaction,
      });

      if (!res?.success) {
        toast.error(res?.message || "Failed to update reaction.");
      }
    });
  };

  const activeReactionData = REACTIONS.find(
    (r) => r.type === optimisticState.userReaction,
  );
  const ActiveIcon = activeReactionData?.icon || ThumbsUp;

  return (
    <div className="flex items-center justify-between text-muted-foreground text-sm border-t border-border/50 pt-4">
      <div className="flex items-center gap-4">
        {/* ================= REACTION POP-OVER CONTAINER ================= */}
        <div className="relative group/reaction flex items-center">
          {/* Hover Popover Menu */}
          <div className="absolute bottom-full left-0 hidden group-hover/reaction:block pb-2 z-50">
            <div className="flex items-center gap-1 p-1.5 bg-popover/95 backdrop-blur-md border border-border rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
              {REACTIONS.map((reaction) => {
                const Icon = reaction.icon;
                return (
                  <button
                    key={reaction.type}
                    disabled={isPending}
                    onClick={() => handleSelectReaction(reaction.type)}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-125 ${reaction.hoverBg}`}
                    title={reaction.label}
                  >
                    <Icon className={`h-5 w-5 ${reaction.color}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Reaction Trigger Button */}
          <button
            onClick={() =>
              handleSelectReaction(optimisticState.userReaction ? null : "LIKE")
            }
            className={`flex items-center gap-1.5 transition-colors group/btn ${
              activeReactionData
                ? activeReactionData.color
                : "hover:text-primary"
            }`}
          >
            <ActiveIcon
              className={`h-4 w-4 group-hover/btn:scale-110 transition-transform ${
                optimisticState.userReaction === "LOVE" ? "fill-rose-500" : ""
              }`}
            />
            <span className="font-medium">
              {activeReactionData ? activeReactionData.label : "Like"} (
              {formatCount(optimisticState.reactionCount)})
            </span>
          </button>
        </div>

        {/* ================= COMMENTS BUTTON ================= */}
        <button className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn">
          <MessageSquare className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          <span>{formatCount(initialData?.comments ?? 0)}</span>
        </button>

        {/* ================= SHARE BUTTON ================= */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Post", url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Copied to clipboard!");
            }
          }}
          className="flex items-center gap-1.5 hover:text-primary transition-colors group/btn"
          title="Share post"
        >
          <Share2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          <span>{formatCount(initialData?.share ?? 0)}</span>
        </button>
      </div>

      {/* ================= VIEWS COUNTER ================= */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
        <Eye className="h-3.5 w-3.5" />
        <span>{formatCount(initialData?.views ?? 0)}</span>
      </div>
    </div>
  );
}
