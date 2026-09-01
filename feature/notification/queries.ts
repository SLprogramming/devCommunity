import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  NotificationItem,
  NotificationPage,
  NotificationType,
} from "@/feature/notification/types";

type NotificationRow = {
  id: string;
  type: NotificationType;
  createdAt: Date;
  postId: string | null;
  commentId: string | null;
  readAt: Date | null;
  actorId: string;
  actorName: string | null;
  actorImage: string | null;
};

function visibilitySql(userId: string) {
  return Prisma.sql`
    (
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
  `;
}

function encodeCursor(row: NotificationRow) {
  return Buffer.from(
    JSON.stringify({ createdAt: row.createdAt.toISOString(), id: row.id }),
  ).toString("base64url");
}

function decodeCursor(cursor?: string) {
  if (!cursor) return null;
  try {
    const value = JSON.parse(Buffer.from(cursor, "base64url").toString());
    if (typeof value.id !== "string" || typeof value.createdAt !== "string") {
      return null;
    }
    const createdAt = new Date(value.createdAt);
    return Number.isNaN(createdAt.valueOf()) ? null : { id: value.id, createdAt };
  } catch {
    return null;
  }
}

function present(row: NotificationRow): NotificationItem {
  const actorName = row.actorName || "Someone";
  const messageByType: Record<NotificationType, string> = {
    NEW_POST_FROM_FOLLOWING: `${actorName} published a new post`,
    COMMENT_ON_POST: `${actorName} commented on your post`,
    REPLY_TO_COMMENT: `${actorName} replied to your comment`,
    REACTION_ON_POST: `${actorName} reacted to your post`,
  };

  return {
    id: row.id,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    read: row.readAt !== null,
    actor: { id: row.actorId, name: actorName, image: row.actorImage },
    postId: row.postId,
    commentId: row.commentId,
    message: messageByType[row.type],
    href: row.postId ? `/post/${row.postId}` : `/profile/${row.actorId}`,
  };
}

export async function getNotificationsForUser(
  userId: string,
  cursor?: string,
  limit = 20,
): Promise<NotificationPage> {
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const decoded = decodeCursor(cursor);
  const cursorSql = decoded
    ? Prisma.sql`AND (e."createdAt", e."id") < (${decoded.createdAt}, ${decoded.id})`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<NotificationRow[]>(Prisma.sql`
    SELECT e."id", e."type", e."createdAt", e."postId", e."commentId",
           r."readAt", a."id" AS "actorId", a."name" AS "actorName",
           a."image" AS "actorImage"
    FROM "notification_event" e
    JOIN "user" a ON a."id" = e."actorId"
    LEFT JOIN "notification_receipt" r
      ON r."eventId" = e."id" AND r."userId" = ${userId}
    WHERE ${visibilitySql(userId)}
      AND r."dismissedAt" IS NULL
      ${cursorSql}
    ORDER BY e."createdAt" DESC, e."id" DESC
    LIMIT ${safeLimit + 1}
  `);

  const hasMore = rows.length > safeLimit;
  const pageRows = rows.slice(0, safeLimit);
  const unreadCount = await getUnreadCountForUser(userId);

  return {
    items: pageRows.map(present),
    nextCursor: hasMore ? encodeCursor(pageRows[pageRows.length - 1]) : null,
    unreadCount,
  };
}

export async function getUnreadCountForUser(userId: string) {
  const [row] = await prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
    SELECT COUNT(*)::bigint AS "count"
    FROM "notification_event" e
    LEFT JOIN "notification_receipt" r
      ON r."eventId" = e."id" AND r."userId" = ${userId}
    WHERE ${visibilitySql(userId)}
      AND r."readAt" IS NULL
      AND r."dismissedAt" IS NULL
  `);
  return Number(row?.count ?? 0);
}

export async function getNotificationSnapshot(userId: string) {
  const [row] = await prisma.$queryRaw<
    Array<{ unreadCount: bigint; latestAt: Date | null }>
  >(Prisma.sql`
    SELECT COUNT(*) FILTER (
             WHERE r."readAt" IS NULL AND r."dismissedAt" IS NULL
           )::bigint AS "unreadCount",
           MAX(e."createdAt") FILTER (WHERE r."dismissedAt" IS NULL) AS "latestAt"
    FROM "notification_event" e
    LEFT JOIN "notification_receipt" r
      ON r."eventId" = e."id" AND r."userId" = ${userId}
    WHERE ${visibilitySql(userId)}
  `);
  return {
    unreadCount: Number(row?.unreadCount ?? 0),
    latestAt: row?.latestAt?.toISOString() ?? null,
  };
}

export async function canUserAccessEvent(userId: string, eventId: string) {
  const [row] = await prisma.$queryRaw<Array<{ allowed: boolean }>>(Prisma.sql`
    SELECT EXISTS (
      SELECT 1 FROM "notification_event" e
      WHERE e."id" = ${eventId} AND ${visibilitySql(userId)}
    ) AS "allowed"
  `);
  return row?.allowed ?? false;
}
