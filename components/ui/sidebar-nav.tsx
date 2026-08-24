"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Compass, Sparkles, UsersRound } from "lucide-react";

const FEED_LINKS = [
  {
    key: "discover",
    label: "Discover",
    href: "/",
    icon: Compass,
  },
  {
    key: "following",
    label: "Following",
    href: "/?tab=following",
    icon: UsersRound,
  },
  {
    key: "latest",
    label: "Latest",
    href: "/?tab=latest",
    icon: Sparkles,
  },
] as const;

export default function SidebarNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "discover";

  return (
    <nav className="flex flex-col gap-2">
      {FEED_LINKS.map(({ key, label, href, icon: Icon }) => {
        const isActive = activeTab === key;

        return (
          <Link
            key={key}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium border transition-all group ${
              isActive
                ? "bg-accent text-accent-foreground border-border shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 transition-colors ${
                isActive ? "text-primary" : "group-hover:text-primary"
              }`}
            />
            {label}
          </Link>
        );
      })}

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
    </nav>
  );
}
