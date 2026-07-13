import React from "react";
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

export default function DevUserProfile() {
  // Mock data for the current logged-in developer
  const user = {
    name: "Taing Linn Maung",
    username: "tainglinn",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "Full-Stack Developer",
    location: "Yangon, Myanmar",
    joined: "Joined June 2024",
    website: "https://github.com/tainglinn",
    bio: "Building high-performance user interfaces with React, TypeScript, and Tailwind CSS. Specializing in slick web apps, clean systems, and lightweight mobile wrappers.",
    skills: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Next.js",
      "Capacitor",
      "Laravel",
      "Bun",
    ],
    stats: [
      { label: "Posts Created", value: "24", icon: FileText },
      { label: "Total Likes", value: "1.2k", icon: Heart },
      { label: "Discussions", value: "184", icon: MessageSquare },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-4">
      {/* Profile Header Card */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl overflow-hidden relative">
        {/* Soft Background Accent Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/10 via-muted to-primary/5 border-b border-border/40" />

        <div className="p-6 pt-0 relative flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Avatar and Info Placement */}
          <div className="flex flex-col sm:flex-row gap-4 -mt-12 items-start sm:items-end">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-card bg-card shadow-md"
            />
            <div className="mb-1">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {/* Edit Profile Action */}
          <button className="text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border px-4 py-2 rounded-xl transition-colors sm:mt-4 self-stretch sm:self-auto text-center">
            Edit Profile
          </button>
        </div>

        {/* Detailed Metadata Footer */}
        <div className="px-6 pb-6 pt-2 border-t border-border/30 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{user.role}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              github.com/tainglinn
            </a>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            <span>{user.joined}</span>
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
              {user.bio}
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
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-muted text-muted-foreground border border-border px-2.5 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Statistics & Activity tabs */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Stats Analytics Header Grid */}
          <div className="grid grid-cols-3 gap-4">
            {user.stats.map((stat, idx) => {
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
    </div>
  );
}
