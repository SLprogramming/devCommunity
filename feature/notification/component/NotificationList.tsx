"use client";

import Link from "next/link";
import { Bell, MessageCircle, Smile, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { NotificationItem } from "@/feature/notification/types";

function relativeTime(value: string) {
  const seconds = Math.max(
    1,
    Math.floor((Date.now() - new Date(value).valueOf()) / 1000),
  );
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d` : new Date(value).toLocaleDateString();
}

function TypeIcon({ type }: { type: NotificationItem["type"] }) {
  if (type === "REACTION_ON_POST") return <Smile className="h-3.5 w-3.5" />;
  if (type === "COMMENT_ON_POST" || type === "REPLY_TO_COMMENT") {
    return <MessageCircle className="h-3.5 w-3.5" />;
  }
  return <UserRound className="h-3.5 w-3.5" />;
}

export function NotificationList({
  items,
  onRead,
  compact = false,
}: {
  items: NotificationItem[];
  onRead: (id: string) => void;
  compact?: boolean;
}) {
  if (!items.length) {
    return (
      <div
        className={`flex flex-col items-center gap-3 text-center text-muted-foreground ${
          compact ? "px-4 py-10" : "border-b border-border px-4 py-16 sm:py-20"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted sm:h-14 sm:w-14">
          <Bell className="h-5 w-5 text-muted-foreground/60 sm:h-6 sm:w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            You’re all caught up
          </p>
          {!compact && (
            <p className="mt-1 max-w-xs text-xs text-muted-foreground sm:text-sm">
              New activity from people you follow will appear here.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          onClick={() => onRead(item.id)}
          className={`group relative flex transition-colors hover:bg-muted/50 ${
            compact
              ? "gap-3 px-3 py-3"
              : "gap-3 py-4 pl-1 pr-1 sm:gap-4 sm:py-5 sm:pl-2 sm:pr-3"
          } ${compact && !item.read ? "bg-primary/5" : "bg-transparent"}`}
        >
          {!compact && !item.read && (
            <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary sm:inset-y-4" />
          )}
          <div className="relative shrink-0">
            <Avatar
              className={`border border-border bg-background ${
                compact ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11"
              }`}
            >
              <AvatarImage src={item.actor.image || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {item.actor.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-background bg-primary p-1 text-primary-foreground shadow-sm">
              <TypeIcon type={item.type} />
            </span>
          </div>
          <div className="min-w-0 flex-1 self-center">
            <p
              className={`break-words text-sm leading-5 text-foreground sm:leading-6 ${
                item.read ? "font-normal" : "font-medium"
              }`}
            >
              {item.message}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {relativeTime(item.createdAt)}
            </p>
          </div>
          {compact && !item.read && (
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </Link>
      ))}
    </div>
  );
}
