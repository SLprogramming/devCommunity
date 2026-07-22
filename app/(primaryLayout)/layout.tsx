import React from "react";
import { TopBar } from "@/components/ui/top-bar";
import { Bookmark, Code, Compass, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* 1. Global Navigation Frame */}
      <TopBar />

      {/* 2. Grid Container Layout Canvas */}
      <div className="mx-auto grid w-full  max-w-7xl flex-1 grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4 sm:px-6 lg:px-8">
        {/* Left Sidebar Channel */}
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] flex-col gap-2 overflow-y-auto md:flex">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent text-accent-foreground font-medium border border-border shadow-sm"
          >
            <Home className="h-5 w-5 text-primary" /> Home
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
          >
            <Compass className="h-5 w-5 group-hover:text-primary transition-colors" />{" "}
            Explore
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
          >
            <Bookmark className="h-5 w-5 group-hover:text-primary transition-colors" />{" "}
            Bookmarks
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
          >
            <Code className="h-5 w-5 group-hover:text-primary transition-colors" />{" "}
            Hackathons
          </Link>

          <hr className="border-border my-4" />

          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
              My Custom Tags
            </span>
            <div className="flex flex-col gap-1 mt-3">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1.5 transition-colors">
                #react
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1.5 transition-colors">
                #nextjs
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer py-1.5 transition-colors">
                #tailwindcss
              </span>
            </div>
          </div>
        </aside>

        {/* 3. Main Stream Content Channel */}
        <main className="md:col-span-3 min-w-0 ">{children}</main>
      </div>
    </div>
  );
}
