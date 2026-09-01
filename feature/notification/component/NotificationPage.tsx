"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNotificationsAction,
  markAllAsReadAction,
  markAsReadAction,
} from "@/feature/notification/actions";
import { NotificationList } from "@/feature/notification/component/NotificationList";
import type { NotificationPage as NotificationPageData } from "@/feature/notification/types";

export function NotificationPage({
  initial,
}: {
  initial: NotificationPageData;
}) {
  const [data, setData] = useState(initial);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const source = new EventSource("/api/notifications/stream");

    source.addEventListener("notifications", () => {
      startTransition(async () => setData(await getNotificationsAction()));
    });
    return () => source.close();
  }, []);

  const markRead = (id: string) => {
    setData((current) => ({
      ...current,
      unreadCount: Math.max(
        0,
        current.unreadCount -
          (current.items.find((x) => x.id === id)?.read ? 0 : 1),
      ),
      items: current.items.map((x) => (x.id === id ? { ...x, read: true } : x)),
    }));
    startTransition(async () => {
      await markAsReadAction(id);
    });
  };

  const markAll = () => {
    setData((current) => ({
      ...current,
      unreadCount: 0,
      items: current.items.map((x) => ({ ...x, read: true })),
    }));
    startTransition(async () => {
      await markAllAsReadAction();
    });
  };

  const loadMore = () => {
    if (!data.nextCursor) return;
    const cursor = data.nextCursor;
    startTransition(async () => {
      const next = await getNotificationsAction(cursor);
      setData((current) => ({
        ...next,
        items: [...current.items, ...next.items],
      }));
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl min-w-0">
      <header className="flex items-start justify-between gap-3 border-b border-border pb-4 pt-1 sm:items-center sm:pb-5">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Notifications
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {data.unreadCount
              ? `${data.unreadCount} unread`
              : "You’re up to date"}
          </p>
        </div>
        {data.unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={markAll}
            className="h-8 shrink-0 gap-1.5 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary sm:h-9 sm:px-3"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark all</span>
          </Button>
        )}
      </header>
      <NotificationList items={data.items} onRead={markRead} />
      {data.nextCursor && (
        <div className="border-t border-border py-5 text-center">
          <Button variant="ghost" disabled={pending} onClick={loadMore}>
            {pending ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </section>
  );
}
