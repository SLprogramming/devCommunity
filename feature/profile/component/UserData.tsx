"use cache";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Send,
  Terminal,
  Layers,
  Award,
  Heart,
  MessageSquare,
  FileText,
} from "lucide-react";

import { getUserProfile } from "@/feature/profile/queries";
import { notFound, redirect } from "next/navigation";

import { createProfileAction } from "@/feature/profile/actions";
import Image from "next/image";
import Link from "next/link";
export default async function UserData({
  userId: id,
  ownProfile,
}: {
  userId: string;
  ownProfile: boolean;
}) {
  const user = await getUserProfile(id);

  if (user && !user.profile) {
    createProfileAction(id);
  }

  if (!user) notFound();

  // Mock data for developer metrics
  const stats = [
    { label: "Posts Created", value: "24", icon: FileText },
    { label: "Total Likes", value: "1.2k", icon: Heart },
    { label: "Discussions", value: "184", icon: MessageSquare },
  ];

  return (
    <>
      {/* Profile Header Card */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden relative">
        {/* Soft Background Accent Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/10 via-muted to-primary/5 border-b border-border/40" />

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Avatar and Info Placement */}
          <div className="flex flex-col sm:flex-row gap-4 -mt-12 items-start sm:items-end">
            <Image
              width={96}
              height={96}
              src={
                user?.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              }
              alt={user?.name || "User Avatar"}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card bg-card shadow-md"
            />
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {user?.name || "User Name"}
              </h1>
              <p className="text-sm text-muted-foreground">@{user?.name}</p>
            </div>
          </div>

          {/* Conditional Edit Action — Rendered ONLY for Profile Owner */}
          {ownProfile && (
            <Link
              href={`/profile/${user?.id}/edit`}
              className="text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition-colors sm:mt-4 self-stretch sm:self-auto text-center"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* Detailed Metadata Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-border/30 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{user?.profile?.jobTitle || "Developer"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user?.profile?.address || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            {user?.profile?.githubLink ? (
              <a
                href={user.profile.githubLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                {user.profile.githubLink}
              </a>
            ) : (
              <span>No link added</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {user?.profile?.createdAt
                ? new Date(user.profile.createdAt).toLocaleDateString()
                : "Joined recently"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Hand: About & Skills Panels */}
        <div className="flex flex-col gap-6">
          {/* Bio Card */}
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> About Me
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
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
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {user?.profile?.techStack && user.profile.techStack.length > 0 ? (
                user.profile.techStack.map((skill) => (
                  <span
                    key={skill?.id}
                    className="text-xs bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-lg"
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

        {/* Right Hand: Statistics & Activity tabs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Stats Analytics Header Grid */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-card text-card-foreground border border-border rounded-2xl p-4 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-xs font-medium hidden sm:inline">
                      {stat.label}
                    </span>
                    <span className="text-xs font-medium sm:hidden">
                      {stat.label.split(" ")[0]}
                    </span>
                    <IconComponent className="w-4 h-4 text-muted-foreground/70" />
                  </div>
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* User History/Activity Feed Filter Container */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 border-b border-border pb-2">
              <button className="text-sm font-semibold text-foreground border-b-2 border-primary pb-2 px-1">
                Recent Posts
              </button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
                Comments
              </button>
              <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-2 px-1 transition-colors">
                Bookmarks
              </button>
            </div>

            {/* Empty Context Placeholder for Activity */}
            <div className="border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-medium text-foreground">
                No recent activity found
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Articles published or shared contributions will populate
                directly into this pipeline feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// app/(primaryLayout)/profile/loading.tsx or components/ProfileSkeleton.tsx

export async function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile Header Card Skeleton */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden relative">
        {/* Banner */}
        <div className="h-32 bg-muted/40 border-b border-border/40" />

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Avatar and Name Placement */}
          <div className="flex flex-col sm:flex-row gap-4 -mt-12 items-start sm:items-end">
            <div className="w-24 h-24 rounded-2xl bg-muted border-4 border-card shadow-md" />
            <div className="mb-1 space-y-2 pb-1">
              <div className="h-6 w-40 bg-muted rounded-md" />
              <div className="h-4 w-24 bg-muted/60 rounded-md" />
            </div>
          </div>

          {/* Edit Button */}
          <div className="h-8 w-24 bg-muted rounded-xl sm:mt-4 self-stretch sm:self-auto" />
        </div>

        {/* Detailed Metadata Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-border/30 flex flex-wrap gap-x-6 gap-y-2">
          <div className="h-4 w-28 bg-muted/60 rounded-md" />
          <div className="h-4 w-32 bg-muted/60 rounded-md" />
          <div className="h-4 w-36 bg-muted/60 rounded-md" />
          <div className="h-4 w-24 bg-muted/40 rounded-md ml-auto" />
        </div>
      </div>

      {/* Main Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Hand Panel */}
        <div className="flex flex-col gap-6">
          {/* About Me Card */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="h-4 w-24 bg-muted rounded-md" />
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-muted/60 rounded-md" />
              <div className="h-3.5 w-full bg-muted/60 rounded-md" />
              <div className="h-3.5 w-3/4 bg-muted/60 rounded-md" />
            </div>
          </div>

          {/* Tech Stack Card */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="h-4 w-20 bg-muted rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              <div className="h-6 w-14 bg-muted rounded-lg" />
              <div className="h-6 w-16 bg-muted rounded-lg" />
              <div className="h-6 w-12 bg-muted rounded-lg" />
              <div className="h-6 w-20 bg-muted rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Hand Panel */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Stats Analytics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-muted/70 rounded-md" />
                  <div className="w-4 h-4 bg-muted/50 rounded-md" />
                </div>
                <div className="h-7 w-10 bg-muted rounded-md" />
              </div>
            ))}
          </div>

          {/* Activity Feed Container */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 border-b border-border pb-2">
              <div className="h-4 w-20 bg-muted rounded-md pb-2" />
              <div className="h-4 w-16 bg-muted/50 rounded-md pb-2" />
              <div className="h-4 w-20 bg-muted/50 rounded-md pb-2" />
            </div>

            {/* Empty Context Box */}
            <div className="border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center gap-3">
              <div className="h-4 w-36 bg-muted rounded-md" />
              <div className="h-3 w-56 bg-muted/60 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
