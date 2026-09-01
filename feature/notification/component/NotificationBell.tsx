"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotificationsAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/feature/notification/actions";
import { NotificationList } from "@/feature/notification/component/NotificationList";
import type { NotificationPage } from "@/feature/notification/types";

export function NotificationBell({ initial }: { initial: NotificationPage }) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(async () => setData(await getNotificationsAction(undefined, 8)));
  }, []);

  useEffect(() => {
    const source = new EventSource("/api/notifications/stream");
    source.addEventListener("notifications", refresh);
    return () => source.close();
  }, [refresh]);

  const markRead = (id: string) => {
    setData((current) => ({
      ...current,
      unreadCount: Math.max(0, current.unreadCount - (current.items.find((x) => x.id === id)?.read ? 0 : 1)),
      items: current.items.map((item) => item.id === id ? { ...item, read: true } : item),
    }));
    startTransition(async () => { await markAsReadAction(id); });
  };

  const markAll = () => {
    setData((current) => ({ ...current, unreadCount: 0, items: current.items.map((x) => ({ ...x, read: true })) }));
    startTransition(async () => { await markAllAsReadAction(); });
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && refresh()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          {data.unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-destructive px-1.5 text-[10px] font-semibold leading-5 text-destructive-foreground ring-2 ring-background">
              {data.unreadCount > 99 ? "99+" : data.unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden p-0">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {data.unreadCount > 0 && (
            <button disabled={pending} onClick={markAll} className="text-xs font-medium text-primary hover:underline disabled:opacity-50">Mark all read</button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="max-h-[28rem] overflow-y-auto">
          <NotificationList items={data.items} onRead={markRead} compact />
        </div>
        <DropdownMenuSeparator className="m-0" />
        <Button asChild variant="ghost" className="h-10 w-full rounded-none text-xs">
          <Link href="/notifications">View all notifications</Link>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
