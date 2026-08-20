"use client";
import {
  Globe,
  Loader2,
  AlertCircle,
  RotateCcw,
  X,
  ThumbsUp,
  Eye,
  ImagePlus,
  Paperclip,
  Smile,
  Type,
  Maximize2,
  Minimize2,
  Hash,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePostQueue } from "../store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
function useSimulatedProgress(isPending: boolean) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    if (!isPending) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92; // Hold at 92% until server Action finishes and removes item
        }
        // Moves faster at the start, then gradually slows down
        const step = Math.max(1, Math.floor((95 - prev) / 7));
        return prev + step;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [isPending]);

  return progress;
}

// Separate component to handle individual pending state safely
function PendingPostCard({ item }: { item: any }) {
  const progress = useSimulatedProgress(item?.status === "pending");

  return (
    <div className="bg-card w-full max-w-3xl text-card-foreground border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden transition-all shadow-sm min-w-0">
      {/* Dynamic Simulated Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Author Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src={item?.user?.image || "/placeholder-avatar.png"}
            alt="Author photo"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover border border-border shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-medium text-foreground/90 truncate">
              You
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 truncate">
              <Globe className="h-3 w-3 text-muted-foreground/70 shrink-0" />
              <span className="truncate">Publishing to feed...</span>
            </p>
          </div>
        </div>

        {/* Status Badge with Live Percentage */}
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-muted/60 text-muted-foreground text-[11px] sm:text-xs font-medium border border-border shrink-0">
          <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin text-primary" />
          <span>Posting {progress}%</span>
        </span>
      </div>

      {/* Post Content / Caption */}
      {item?.caption && (
        <h2 className="text-base sm:text-xl font-bold text-foreground mb-2 sm:mb-3 leading-snug break-words">
          {item.caption}
        </h2>
      )}
      {item?.content && (
        <p className="text-xs sm:text-sm text-foreground/80 mb-3 break-words">
          {item.content}
        </p>
      )}

      {/* Optional Image Uploading Preview with Centered Loader */}
      {item?.imagePreview && (
        <div className="relative mb-4 h-72 sm:h-96 w-full overflow-hidden rounded-lg sm:rounded-xl border border-border bg-muted/30">
          <Image
            fill
            priority
            src={item.imagePreview}
            alt="Uploading preview"
            className="object-cover brightness-95"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 bg-background/30 backdrop-blur-[2px] sm:gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary sm:h-8 sm:w-8" />
            <span className="rounded-full border border-border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-foreground shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
              {progress}% uploaded
            </span>
          </div>
        </div>
      )}

      {/* Pending Hashtags */}
      {item?.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {item.hashtags.map((hashtag: string, idx: number) => (
            <span
              key={`${item.id}-tag-${idx}`}
              className="text-[11px] sm:text-xs font-mono bg-muted/60 text-muted-foreground px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-border"
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Actions Placeholder */}
      <div className="flex items-center justify-between text-muted-foreground text-xs sm:text-sm border-t border-border/50 pt-3 sm:pt-4 opacity-50 select-none gap-2 flex-wrap">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <ThumbsUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground/80 shrink-0">
          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>0</span>
        </div>
      </div>
    </div>
  );
}

// Main Queue Container Component
export function PostCreateQueue() {
  const postQueue = usePostQueue();

  if (!postQueue?.queue?.length) return null;

  return (
    <div className="w-full space-y-3 sm:space-y-4 min-w-0">
      {postQueue.queue.map((item) => {
        // FAILED STATE
        if (item?.status === "failed") {
          return (
            <div
              key={item.id}
              className="bg-card w-full max-w-3xl text-card-foreground border border-destructive/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all shadow-sm min-w-0"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <img
                    src={item?.user?.image || "/placeholder-avatar.png"}
                    alt="Author photo"
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover border border-border shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-foreground/90 truncate">
                      You
                    </h4>
                    <p className="text-[11px] sm:text-xs text-destructive font-medium truncate">
                      Failed to upload
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-destructive/10 text-destructive text-[11px] sm:text-xs font-medium border border-destructive/20">
                    <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>Failed</span>
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => postQueue.removePost?.(item.id)}
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Show actual failed caption or content */}
              <h2 className="text-base sm:text-xl font-bold text-foreground mb-3 leading-snug break-words">
                {item?.caption ||
                  item?.content ||
                  "Failed post draft preserved here."}
              </h2>

              <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-lg sm:rounded-xl p-2.5 sm:p-3 mt-3 sm:mt-4 text-[11px] sm:text-xs gap-2">
                <span className="text-destructive font-medium truncate">
                  Something went wrong while publishing.
                </span>
              </div>
            </div>
          );
        }

        // PENDING / PUBLISHING STATE
        return <PendingPostCard key={item.id} item={item} />;
      })}
    </div>
  );
}
