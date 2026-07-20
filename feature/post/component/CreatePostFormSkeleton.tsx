export default function CreatePostCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto animate-pulse">
      <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md p-4 sm:p-5 space-y-4 shadow-md">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar Skeleton */}
            <div className="w-11 h-11 rounded-full bg-muted shrink-0" />
            <div className="space-y-2">
              {/* User Name Skeleton */}
              <div className="h-4 w-28 bg-muted rounded" />
              {/* Badge/Privacy Skeleton */}
              <div className="h-3 w-16 bg-muted/60 rounded-full" />
            </div>
          </div>
          {/* Action/Expand Button Skeleton */}
          <div className="w-8 h-8 rounded-lg bg-muted/60" />
        </div>

        {/* Prompt Bar / Text Area Placeholder Skeleton */}
        <div className="p-3.5 rounded-xl bg-accent/40 border border-border/60 flex items-center justify-between gap-3">
          <div className="h-4 w-3/5 bg-muted/70 rounded" />
          <div className="h-4 w-20 bg-muted/70 rounded" />
        </div>

        {/* Action Footer Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-2">
            {/* Media Option Skeleton */}
            <div className="h-7 w-20 bg-muted/60 rounded-lg" />
            {/* Hashtag Option Skeleton */}
            <div className="h-7 w-22 bg-muted/60 rounded-lg" />
          </div>

          {/* Submit Button Skeleton */}
          <div className="h-8 w-24 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}
