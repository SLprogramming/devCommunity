import React from 'react'

export const EditFormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Main Settings Card */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-8 relative overflow-hidden">
        
        {/* Avatar Placement Group */}
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-muted shrink-0" />
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted rounded-md" />
            <div className="h-3 w-64 bg-muted/70 rounded-md" />
          </div>
        </div>

        <hr className="border-border/50" />

        {/* Input Grid Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Label + Input Skeleton (Name) */}
          <div className="space-y-2">
            <div className="h-3.5 w-20 bg-muted rounded-md" />
            <div className="h-10 w-full bg-muted/60 border border-border/50 rounded-xl" />
          </div>

          {/* Label + Input Skeleton (Job Title) */}
          <div className="space-y-2">
            <div className="h-3.5 w-20 bg-muted rounded-md" />
            <div className="h-10 w-full bg-muted/60 border border-border/50 rounded-xl" />
          </div>

          {/* Label + Input Skeleton (Location) */}
          <div className="space-y-2">
            <div className="h-3.5 w-20 bg-muted rounded-md" />
            <div className="h-10 w-full bg-muted/60 border border-border/50 rounded-xl" />
          </div>

          {/* Label + Input Skeleton (GitHub Link) */}
          <div className="space-y-2">
            <div className="h-3.5 w-24 bg-muted rounded-md" />
            <div className="h-10 w-full bg-muted/60 border border-border/50 rounded-xl" />
          </div>
        </div>

        {/* Textarea - Bio */}
        <div className="space-y-2">
          <div className="h-3.5 w-28 bg-muted rounded-md" />
          <div className="h-28 w-full bg-muted/60 border border-border/50 rounded-xl" />
        </div>

        <hr className="border-border/50" />

        {/* Tech Stack Array UI Component */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-muted rounded-md" />
            <div className="h-3 w-60 bg-muted/70 rounded-md" />
          </div>

          {/* Add Skill Field Wrapper */}
          <div className="flex gap-2 max-w-md">
            <div className="flex-1 h-9 bg-muted/60 border border-border/50 rounded-xl" />
            <div className="w-9 h-9 bg-muted rounded-xl shrink-0" />
          </div>

          {/* Badge Skeleton Collection */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            <div className="h-7 w-20 bg-muted rounded-lg" />
            <div className="h-7 w-24 bg-muted rounded-lg" />
            <div className="h-7 w-28 bg-muted rounded-lg" />
            <div className="h-7 w-16 bg-muted rounded-lg" />
          </div>
        </div>

      </div>

      {/* Footer Actions Panel Container */}
      <div className="flex items-center justify-end gap-3">
        <div className="h-10 w-20 bg-muted/80 border border-border/50 rounded-xl" />
        <div className="h-10 w-32 bg-muted rounded-xl" />
      </div>
    </div>
  )
}

export default EditFormSkeleton