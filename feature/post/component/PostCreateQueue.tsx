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
    <div className="bg-card max-w-3xl text-card-foreground border border-border rounded-2xl p-6 relative overflow-hidden transition-all shadow-sm">
      {/* Dynamic Simulated Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Author Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={item?.user?.image || "/placeholder-avatar.png"}
            alt="Author photo"
            className="h-8 w-8 rounded-lg object-cover border border-border"
          />
          <div>
            <h4 className="text-sm font-medium text-foreground/90">You</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3 text-muted-foreground/70" />
              <span>Publishing to feed...</span>
            </p>
          </div>
        </div>

        {/* Status Badge with Live Percentage */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/60 text-muted-foreground text-xs font-medium border border-border">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span>Posting {progress}%</span>
        </span>
      </div>

      {/* Post Content / Caption */}
      {item?.caption && (
        <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">
          {item.caption}
        </h2>
      )}
      {item?.content && (
        <p className="text-sm text-foreground/80 mb-3">{item.content}</p>
      )}

      {/* Optional Image Uploading Preview with Centered Loader */}
      {item?.imagePreview && (
        <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted/30 relative max-h-96">
          <img
            src={item.imagePreview}
            alt="Uploading preview"
            className="w-full max-h-96 object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs font-medium text-foreground bg-background/80 px-2.5 py-1 rounded-full border border-border shadow-sm">
              {progress}% uploaded
            </span>
          </div>
        </div>
      )}

      {/* Pending Hashtags */}
      {item?.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {item.hashtags.map((hashtag: string, idx: number) => (
            <span
              key={`${item.id}-tag-${idx}`}
              className="text-xs font-mono bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-md border border-border"
            >
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Actions Placeholder */}
      <div className="flex items-center justify-between text-muted-foreground text-sm border-t border-border/50 pt-4 opacity-50 select-none">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" />
            <span>0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4" />
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
          <Eye className="h-3.5 w-3.5" />
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
    <div className="w-full space-y-4">
      {postQueue.queue.map((item) => {
        // FAILED STATE
        if (item?.status === "failed") {
          return (
            <div
              key={item.id}
              className="bg-card max-w-3xl text-card-foreground border border-destructive/40 rounded-2xl p-6 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item?.user?.image || "/placeholder-avatar.png"}
                    alt="Author photo"
                    className="h-8 w-8 rounded-lg object-cover border border-border"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-foreground/90">
                      You
                    </h4>
                    <p className="text-xs text-destructive font-medium">
                      Failed to upload
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Failed</span>
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => postQueue.removePost?.(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Show actual failed caption or content */}
              <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">
                {item?.caption ||
                  item?.content ||
                  "Failed post draft preserved here."}
              </h2>

              <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-xl p-3 mt-4 text-xs">
                <span className="text-destructive font-medium">
                  Something went wrong while publishing.
                </span>
                {/* <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs gap-1.5 px-3 rounded-lg"
                  onClick={() => {}}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </Button> */}
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
