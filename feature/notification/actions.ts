"use server";

import { Prisma } from "@/app/generated/prisma/client";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import {
  canUserAccessEvent,
  getNotificationsForUser,
  getUnreadCountForUser,
} from "@/feature/notification/queries";

async function requireUserId() {
  const session = await getSession();
  return session?.user?.id ?? null;
}

export async function getNotificationsAction(cursor?: string, limit?: number) {
  const userId = await requireUserId();
  if (!userId) return { items: [], nextCursor: null, unreadCount: 0 };
  return getNotificationsForUser(userId, cursor, limit);
}

export async function getUnreadCountAction() {
  const userId = await requireUserId();
  return userId ? getUnreadCountForUser(userId) : 0;
}

export async function markAsReadAction(eventId: string) {
  const userId = await requireUserId();
  if (!userId || !(await canUserAccessEvent(userId, eventId))) {
    return { success: false };
  }
  await prisma.notificationReceipt.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId, readAt: new Date() },
    update: { readAt: new Date() },
  });
  return { success: true };
}

export async function markAllAsReadAction() {
  const userId = await requireUserId();
  if (!userId) return { success: false };
  await prisma.$executeRaw(Prisma.sql`
    INSERT INTO "notification_receipt" ("eventId", "userId", "readAt")
    SELECT e."id", ${userId}, NOW()
    FROM "notification_event" e
    WHERE (
      e."recipientId" = ${userId}
      OR (
        e."type" = 'NEW_POST_FROM_FOLLOWING'::"NotificationType"
        AND EXISTS (
          SELECT 1 FROM "follow" f
          WHERE f."followerId" = ${userId}
            AND f."followingId" = e."actorId"
            AND e."createdAt" >= f."createdAt"
        )
      )
    )
    ON CONFLICT ("eventId", "userId") DO UPDATE SET "readAt" = NOW()
  `);
  return { success: true };
}

export async function deleteNotificationAction(eventId: string) {
  const userId = await requireUserId();
  if (!userId || !(await canUserAccessEvent(userId, eventId))) {
    return { success: false };
  }
  await prisma.notificationReceipt.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId, dismissedAt: new Date() },
    update: { dismissedAt: new Date() },
  });
  return { success: true };
}
