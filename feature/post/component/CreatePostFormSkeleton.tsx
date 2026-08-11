export default function CreatePostCardSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0 animate-pulse">
      <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md text-card-foreground shadow-md p-3 sm:p-5 space-y-3 sm:space-y-4">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Avatar Skeleton */}
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted border border-border shrink-0" />

            <div className="min-w-0 flex-1 space-y-1.5">
              {/* User Name Skeleton */}
              <div className="h-3.5 sm:h-4 w-24 sm:w-32 bg-muted rounded-md" />

              {/* Badge & Privacy Status Skeleton */}
              <div className="flex items-center gap-1">
                <div className="h-3 sm:h-3.5 w-12 sm:w-14 bg-accent/80 rounded-full shrink-0" />
                <div className="h-2 w-2 bg-muted/40 rounded-full" />
                <div className="h-3 w-10 bg-muted/60 rounded-md shrink-0" />
              </div>
            </div>
          </div>

          {/* Expand/Collapse Button Skeleton */}
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted/60 shrink-0" />
        </div>

        {/* Collapsed Bar / Prompt Placeholder Skeleton */}
        <div className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-accent/40 border border-border/60 flex items-center justify-between gap-2">
          <div className="h-3.5 sm:h-4 w-3/5 sm:w-2/3 bg-muted/70 rounded-md" />
          <div className="h-3.5 sm:h-4 w-16 sm:w-20 bg-muted/70 rounded-md shrink-0" />
        </div>

        {/* Action Footer Bar Skeleton */}
        <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border/60 gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Media Option Skeleton */}
            <div className="h-7 sm:h-8 w-14 sm:w-18 bg-muted/60 rounded-lg shrink-0" />
            {/* Hashtag Option Skeleton */}
            <div className="h-7 sm:h-8 w-16 sm:w-20 bg-muted/60 rounded-lg shrink-0" />
          </div>

          {/* Submit / Publish Button Skeleton */}
          <div className="h-7 sm:h-8 w-18 sm:w-24 bg-muted rounded-lg sm:rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
