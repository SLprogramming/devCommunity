CREATE TYPE "NotificationType" AS ENUM (
  'NEW_POST_FROM_FOLLOWING',
  'COMMENT_ON_POST',
  'REPLY_TO_COMMENT',
  'REACTION_ON_POST'
);

CREATE TABLE "notification_event" (
  "id" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorId" TEXT NOT NULL,
  "recipientId" TEXT,
  "postId" TEXT,
  "commentId" TEXT,
  "reactionId" TEXT,
  CONSTRAINT "notification_event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notification_receipt" (
  "eventId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "dismissedAt" TIMESTAMP(3),
  CONSTRAINT "notification_receipt_pkey" PRIMARY KEY ("eventId", "userId")
);

CREATE UNIQUE INDEX "notification_event_reactionId_key" ON "notification_event"("reactionId");
CREATE INDEX "notification_event_recipientId_createdAt_idx" ON "notification_event"("recipientId", "createdAt");
CREATE INDEX "notification_event_actorId_type_createdAt_idx" ON "notification_event"("actorId", "type", "createdAt");
CREATE INDEX "notification_event_createdAt_id_idx" ON "notification_event"("createdAt", "id");
CREATE INDEX "notification_receipt_userId_readAt_idx" ON "notification_receipt"("userId", "readAt");

ALTER TABLE "notification_event" ADD CONSTRAINT "notification_event_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_event" ADD CONSTRAINT "notification_event_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_event" ADD CONSTRAINT "notification_event_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_event" ADD CONSTRAINT "notification_event_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_event" ADD CONSTRAINT "notification_event_reactionId_fkey" FOREIGN KEY ("reactionId") REFERENCES "reaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_receipt" ADD CONSTRAINT "notification_receipt_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "notification_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notification_receipt" ADD CONSTRAINT "notification_receipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
