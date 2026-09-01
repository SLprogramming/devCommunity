import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/feature/notification/types";

type CreateEventInput = {
  type: NotificationType;
  actorId: string;
  recipientId?: string | null;
  postId?: string | null;
  commentId?: string | null;
  reactionId?: string | null;
};

export async function createNotificationEvent(input: CreateEventInput) {
  if (input.recipientId && input.recipientId === input.actorId) return null;

  return prisma.notificationEvent.create({
    data: {
      type: input.type,
      actorId: input.actorId,
      recipientId: input.recipientId ?? null,
      postId: input.postId ?? null,
      commentId: input.commentId ?? null,
      reactionId: input.reactionId ?? null,
    },
  });
}
