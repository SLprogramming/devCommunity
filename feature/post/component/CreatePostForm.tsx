"use client";
import {
  Globe,
  X,
  ImagePlus,
  Maximize2,
  Minimize2,
  Hash,
  Send,
  Sparkles,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { extractHashtags } from "@/utils/helper";
import { createPostAction } from "../actions";
import { usePostQueue } from "@/feature/post/store";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CreatePostCard() {
  const postQueue = usePostQueue();
  const [isExpanded, setIsExpanded] = useState(false);
  const [caption, setCaption] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxContentLength = 5000;
  const liveHashtags = extractHashtags(`${caption} ${content}`);
  const session = useSession();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userId =
    isMounted && session.data?.user.id ? session.data?.user.id : null;
  const userImage =
    isMounted && session.data?.user.image ? session.data?.user.image : null;
  const userName =
    isMounted && session.data?.user.name ? session.data?.user.name : "";

  // useEffect(() => {
  //   if (state.success) {
  //     setCaption("");
  //     setContent("");
  //     handleRemoveImage();
  //     setIsExpanded(false);
  //   }
  // }, [state]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() && !caption.trim() && !selectedImage) return;
    const cleanContent = content
      .replace(/#[\w\u0590-\u05ff]+/g, "") // Removes #hashtag words
      .replace(/\s+/g, " ") // Replaces multiple spaces/newlines left behind with a single space
      .trim();
    if (!userId) return;
    const formData = new FormData();
    formData.append("authorId", userId);
    formData.append("content", cleanContent);
    if (selectedImage) formData.append("image", selectedImage);
    if (caption) formData.append("caption", caption);
    formData.append("hashtags", JSON.stringify(liveHashtags));

    if (!cleanContent && !caption.trim() && !selectedImage) {
      toast.warning("Please write something or upload an image.");
      return;
    }

    const tempId = uuidv4();
    postQueue.addPost({
      id: tempId,
      caption: caption,
      content: cleanContent,
      imagePreview: imagePreview,
      hashtags: liveHashtags,
      status: "pending",
      user: {
        name: userName,
        image: userImage,
      },
    });

    //   Server action integration here
    createPostAction(formData).then((res) => {
      console.log(res);
      if (!res.success) {
        toast.error(res.message);
        postQueue.changeStatus(tempId, "failed");
      } else {
        toast.success(res.message);
        postQueue.removePost(tempId);
      }
    });
    setCaption("");
    setContent("");
    handleRemoveImage();
    setIsExpanded(false);
    redirect("/");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <div
        className={`rounded-xl sm:rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md text-card-foreground shadow-md transition-all duration-300 overflow-hidden ${
          isDragging ? "ring-2 ring-primary border-transparent" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-5 space-y-3 sm:space-y-4"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-border shrink-0">
                <AvatarImage src={userImage || undefined} alt="User avatar" />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  {userName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                  {userName || "Developer"}
                </h4>
                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium shrink-0">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary shrink-0" />
                    <span>Public</span>
                  </span>
                  <span>•</span>
                  <span className="text-muted-foreground/80 truncate">
                    Drafting
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-accent/40 border border-border/60 hover:bg-accent/70 hover:border-border cursor-pointer transition-all group"
            >
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors truncate">
                What project or insight are you working on?
              </span>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-primary shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                <span className="hidden xs:inline">Create Post</span>
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
                  className="w-full text-xs sm:text-base font-semibold bg-transparent border-b border-border/60 pb-1.5 sm:pb-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Main Rich Content Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={isExpanded ? 3 : 2}
                  maxLength={maxContentLength}
                  placeholder="Share code insights, updates, or technical thoughts... (Use #hashtags)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none leading-relaxed min-h-[70px] sm:min-h-[100px]"
                />

                {/* Character Counter Ring / Text */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1 text-[9px] sm:text-[10px] text-muted-foreground font-mono bg-card/80 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-md border border-border/40">
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
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1">
                  <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground mr-1">
                    Detected Tags:
                  </span>
                  {liveHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium border border-primary/20 shadow-xs"
                    >
                      <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Drag and Drop / Image Upload Zone */}
              {imagePreview ? (
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-border bg-black/40 group max-h-[180px] sm:max-h-[360px] flex items-center justify-center">
                  <Image
                    src={imagePreview}
                    alt="Upload Preview"
                    width={600}
                    height={360}
                    className="w-full h-auto object-cover max-h-[180px] sm:max-h-[360px] rounded-lg sm:rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 sm:p-3">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-destructive text-white transition-colors backdrop-blur-md"
                      title="Remove media"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ) : isDragging ? (
                <div className="p-4 sm:p-8 rounded-lg sm:rounded-xl border-2 border-dashed border-primary bg-primary/5 text-center flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-bounce" />
                  <p className="text-xs font-semibold text-primary">
                    Drop your image here
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Action Footer Bar */}
          <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border/60 gap-1.5 sm:gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1">
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
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-all"
              >
                <ImagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span className="text-[11px] sm:text-xs">Media</span>
              </label>

              {/* Quick Hashtag Insertion Prompt */}
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(true);
                  setContent((prev) => prev + " #");
                  textareaRef.current?.focus();
                }}
                className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0" />
                <span className="text-[11px] sm:text-xs">Hashtag</span>
              </button>
            </div>

            {/* Post Action */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {isExpanded && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={!content.trim() && !caption.trim() && !selectedImage}
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg sm:rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm sm:shadow-md shadow-primary/20 active:scale-95 shrink-0"
              >
                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
