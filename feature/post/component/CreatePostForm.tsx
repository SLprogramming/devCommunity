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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState, useRef, useTransition, useEffect } from "react";
import Image from "next/image";

import { extractHashtags } from "@/utils/helper";
import { useActionState } from "react";
import { createPostAction, type InitialState } from "../actions";
import { useActionToast } from "@/hooks/use-action-toast";

interface CreatePostCardProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}

const initialState: InitialState = {
  message: "",
  success: false,
};
export default function CreatePostCard({ user }: CreatePostCardProps) {
  const [state, formAction, isCreatePostPending] = useActionState(
    createPostAction,
    initialState,
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [caption, setCaption] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxContentLength = 5000;
  const liveHashtags = extractHashtags(`${caption} ${content}`);

  useActionToast(state);

  useEffect(() => {
    return () => {
      startTransition(() => formAction({ type: "RESET" }));
    };
  }, [formAction]);

  useEffect(() => {
    if (state.success) {
      setCaption("");
      setContent("");
      handleRemoveImage();
      setIsExpanded(false);
    }
  }, [state]);

  const handleImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      if (!isExpanded) setIsExpanded(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() && !caption.trim() && !selectedImage) return;
    const cleanContent = content
      .replace(/#[\w\u0590-\u05ff]+/g, "") // Removes #hashtag words
      .replace(/\s+/g, " ") // Replaces multiple spaces/newlines left behind with a single space
      .trim();
    const formData = new FormData();
    formData.append("authorId", user.id);
    formData.append("content", cleanContent);
    if (selectedImage) formData.append("image", selectedImage);
    if (caption) formData.append("caption", caption);
    formData.append("hashtags", JSON.stringify(liveHashtags));

    startTransition(async () => {
      //   Server action integration here
      await formAction(formData);
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md text-card-foreground shadow-md transition-all duration-300 overflow-hidden ${
          isDragging ? "ring-2 ring-primary border-transparent" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 bg-muted shrink-0 shadow-sm">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground tracking-tight">
                  {user.name || "Developer"}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
                    <Globe className="w-3 h-3 text-primary" />
                    Public
                  </span>
                  <span>•</span>
                  <span className="text-muted-foreground/80">Drafting</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsed Bar View / Interactive Prompt */}
          {!isExpanded && !imagePreview && !caption && !content ? (
            <div
              onClick={() => {
                setIsExpanded(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-accent/40 border border-border/60 hover:bg-accent/70 hover:border-border cursor-pointer transition-all group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                What project or insight are you working on?
              </span>
              <div className="flex items-center gap-2 text-xs font-medium text-primary">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Create Post</span>
              </div>
            </div>
          ) : (
            /* Expanded Creator Form */
            <div className="space-y-3 pt-1 animate-in fade-in-50 duration-200">
              {/* Optional Headline / Sub-header */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Headline or Title (Optional)..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-base font-semibold bg-transparent border-b border-border/60 pb-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Main Rich Content Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={isExpanded ? 4 : 2}
                  maxLength={maxContentLength}
                  placeholder="Share code insights, updates, or technical thoughts... (Use #hashtags)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none leading-relaxed"
                />

                {/* Character Counter Ring / Text */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono bg-card/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-border/40">
                  <span
                    className={
                      content.length >= maxContentLength - 20
                        ? "text-destructive font-bold"
                        : ""
                    }
                  >
                    {content.length}
                  </span>
                  <span>/ {maxContentLength}</span>
                </div>
              </div>

              {/* Live Hashtags Display */}
              {liveHashtags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-muted-foreground mr-1">
                    Detected Tags:
                  </span>
                  {liveHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium border border-primary/20 shadow-xs"
                    >
                      <Hash className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Drag and Drop / Image Upload Zone */}
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-border bg-black/40 group max-h-[360px] flex items-center justify-center">
                  <Image
                    src={imagePreview}
                    alt="Upload Preview"
                    width={600}
                    height={360}
                    className="w-full h-auto object-cover max-h-[360px] rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-3">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 rounded-full bg-black/70 hover:bg-destructive text-white transition-colors backdrop-blur-md"
                      title="Remove media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : isDragging ? (
                <div className="p-8 rounded-xl border-2 border-dashed border-primary bg-primary/5 text-center flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="w-8 h-8 text-primary animate-bounce" />
                  <p className="text-xs font-semibold text-primary">
                    Drop your image here
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="post-image-input-v2"
              />

              {/* Photo Button */}
              <label
                htmlFor="post-image-input-v2"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-all"
              >
                <ImagePlus className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Media</span>
              </label>

              {/* Quick Hashtag Insertion Prompt */}
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(true);
                  setContent((prev) => prev + " #");
                  textareaRef.current?.focus();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Hash className="w-4 h-4 text-sky-500" />
                <span className="hidden sm:inline">Hashtag</span>
              </button>
            </div>

            {/* Post Action */}
            <div className="flex items-center gap-2">
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={
                  isPending ||
                  (!content.trim() && !caption.trim() && !selectedImage)
                }
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-primary/20 active:scale-95"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PostCreateQueue() {
  return (
    <div className="w-full space-y-4">
      {/* ==================== ITEM 1: PUBLISHING STATE ==================== */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 relative overflow-hidden transition-all shadow-sm">
        {/* Top Animated Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div className="h-full bg-primary animate-pulse w-2/3 transition-all duration-500" />
        </div>

        {/* Author Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/placeholder-avatar.png"
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

          {/* Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/60 text-muted-foreground text-xs font-medium border border-border">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Posting...</span>
          </span>
        </div>

        {/* Post Caption */}
        <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">
          Building optimistic UI queues in Next.js App Router using React 19
          primitives! 🚀
        </h2>

        {/* Optional Image Uploading Preview */}
        <div className="mb-4 overflow-hidden rounded-xl border border-border bg-muted/30 relative max-h-96">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"
            alt="Uploading preview"
            className="w-full max-h-96 object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>

        {/* Pending Hashtags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs font-mono bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-md border border-border">
            #nextjs
          </span>
          <span className="text-xs font-mono bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-md border border-border">
            #webdev
          </span>
        </div>

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

      {/* ==================== ITEM 2: FAILED STATE WITH RETRY ==================== */}
      <div className="bg-card text-card-foreground border border-destructive/40 rounded-2xl p-6 transition-all shadow-sm">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/placeholder-avatar.png"
              alt="Author photo"
              className="h-8 w-8 rounded-lg object-cover border border-border"
            />
            <div>
              <h4 className="text-sm font-medium text-foreground/90">You</h4>
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
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Failed Content */}
        <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">
          Failed post content draft preserved here so you never lose your
          thoughts.
        </h2>

        {/* Retry Banner Footer */}
        <div className="flex items-center justify-between bg-destructive/10 border border-destructive/20 rounded-xl p-3 mt-4 text-xs">
          <span className="text-destructive font-medium">
            Something went wrong while publishing.
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="h-8 text-xs gap-1.5 px-3 rounded-lg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
