"use cache";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Send,
  Terminal,
  Layers,
  Award,
  Users,
  UserCheck,
} from "lucide-react";
import { PostTimestamp } from "@/feature/post/component/PostTimestamp";
import Link from "next/link";

import { getUserProfile } from "@/feature/profile/queries";
import { notFound } from "next/navigation";
import { createProfileAction } from "@/feature/profile/actions";
import Image from "next/image";
import { formatCount } from "@/utils/helper";

import ProfileStatsWarper from "./ProfileStatsWarper";
import ProfileButtonsWrapper from "./ProfileButtonsWarper";
import { Suspense } from "react";

export default async function UserData({ userId: id }: { userId: string }) {
  const user = await getUserProfile(id);

  if (user && !user.profile) {
    createProfileAction(id);
  }

  if (!user) notFound();

  // Mock counter values (replace with actual dynamic props/queries when ready)

  return (
    <>
      {/* Profile Header Card */}
      <div className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl overflow-hidden relative">
        {/* Soft Background Accent Banner */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary/10 via-muted to-primary/5 border-b border-border/40" />

        <div className="p-4 sm:p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          {/* Avatar and Info Placement */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 -mt-10 sm:-mt-12 items-start sm:items-end min-w-0 w-full sm:w-auto">
            <Image
              width={96}
              height={96}
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              }
              alt={user?.name || "User Avatar"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-card bg-card shadow-md shrink-0"
            />
            <div className="mb-0 sm:mb-1 min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">
                {user?.name || "User Name"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>

              {/* Followers / Following Counts */}
              <Link
                href={`/profile/${id}/network`}
                className="flex items-center gap-4 mt-2 text-xs text-muted-foreground"
              >
                <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                  <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {formatCount(user?.followers?.length || 0)}
                  </span>
                  <span>Followers</span>
                </div>
                <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                  <UserCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {formatCount(user?.following?.length || 0)}
                  </span>
                  <span>Following</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Conditional Edit/Follow Action */}
          <Suspense
            fallback={
              <div className="h-9 w-24 bg-muted animate-pulse rounded-xl mt-2 sm:mt-4 shrink-0" />
            }
          >
            <ProfileButtonsWrapper userId={id} />
          </Suspense>
        </div>

        {/* Detailed Metadata Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t border-border/30 flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">
              {user?.profile?.jobTitle || "Developer"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {user?.profile?.address || "Remote"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0 max-w-full sm:max-w-xs">
            <LinkIcon className="w-3.5 h-3.5 shrink-0" />
            {user?.profile?.githubLink ? (
              <a
                href={user.profile.githubLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors truncate"
              >
                {user.profile.githubLink}
              </a>
            ) : (
              <span className="truncate">No link added</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:ml-auto shrink-0">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {user?.profile?.createdAt ? (
                <PostTimestamp createdAt={user.profile.createdAt} />
              ) : (
                "Joined recently"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Hand: About & Skills Panels */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Bio Card */}
          <div className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary shrink-0" /> About Me
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
              {user?.profile?.bio || "This user has not added a bio yet."}
            </p>
            <div className="flex gap-3 pt-2 border-t border-border/40 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                <Terminal className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Skills / Tech Stack Card */}
          <div className="bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user?.profile?.techStack && user.profile.techStack.length > 0 ? (
                user.profile.techStack.map((skill) => (
                  <span
                    key={skill?.id}
                    className="text-[11px] sm:text-xs bg-muted text-muted-foreground border border-border px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg"
                  >
                    {skill?.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  No tech stack added yet.
                </span>
              )}
            </div>
          </div>
        </div>

        <ProfileStatsWarper id={id} />
      </div>
    </>
  );
}

// Loading Skeleton
export async function ProfileSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse w-full max-w-full overflow-hidden">
      {/* Profile Header Card Skeleton */}
      <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden relative">
        <div className="h-24 sm:h-32 bg-muted/40 border-b border-border/40" />

        <div className="p-4 sm:p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 -mt-10 sm:-mt-12 items-start sm:items-end w-full sm:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border-4 border-card shadow-md shrink-0" />
            <div className="mb-0 sm:mb-1 space-y-2 pb-1 w-full sm:w-auto">
              <div className="h-5 sm:h-6 w-36 sm:w-40 bg-muted rounded-md" />
              <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-muted/60 rounded-md" />
              <div className="flex gap-4 pt-1">
                <div className="h-3.5 w-20 bg-muted/50 rounded-md" />
                <div className="h-3.5 w-20 bg-muted/50 rounded-md" />
              </div>
            </div>
          </div>

          <div className="h-8 w-full sm:w-24 bg-muted rounded-xl sm:mt-4 self-stretch sm:self-auto shrink-0" />
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-border/30 flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
          <div className="h-3.5 sm:h-4 w-24 sm:w-28 bg-muted/60 rounded-md shrink-0" />
          <div className="h-3.5 sm:h-4 w-28 sm:w-32 bg-muted/60 rounded-md shrink-0" />
          <div className="h-3.5 sm:h-4 w-32 sm:w-36 bg-muted/60 rounded-md shrink-0" />
          <div className="h-3.5 sm:h-4 w-20 sm:w-24 bg-muted/40 rounded-md sm:ml-auto shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="h-4 w-24 bg-muted rounded-md" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-muted/60 rounded-md" />
              <div className="h-3.5 w-full bg-muted/60 rounded-md" />
              <div className="h-3.5 w-3/4 bg-muted/60 rounded-md" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="h-4 w-20 bg-muted rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              <div className="h-6 w-14 bg-muted rounded-lg" />
              <div className="h-6 w-16 bg-muted rounded-lg" />
              <div className="h-6 w-12 bg-muted rounded-lg" />
              <div className="h-6 w-20 bg-muted rounded-lg" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4 sm:gap-6 min-w-0">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col gap-2 min-w-0"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="h-3 w-12 sm:w-16 bg-muted/70 rounded-md shrink-0" />
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-muted/50 rounded-md shrink-0" />
                </div>
                <div className="h-6 sm:h-7 w-8 sm:w-10 bg-muted rounded-md" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 border-b border-border pb-2 overflow-x-auto no-scrollbar">
              <div className="h-4 w-20 bg-muted rounded-md shrink-0" />
              <div className="h-4 w-16 bg-muted/50 rounded-md shrink-0" />
              <div className="h-4 w-20 bg-muted/50 rounded-md shrink-0" />
            </div>

            <div className="border border-dashed border-border rounded-xl sm:rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-2 sm:gap-3 text-center">
              <div className="h-4 w-36 bg-muted rounded-md" />
              <div className="h-3 w-48 sm:w-56 bg-muted/60 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
