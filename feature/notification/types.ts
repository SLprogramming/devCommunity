export type NotificationType =
  | "NEW_POST_FROM_FOLLOWING"
  | "COMMENT_ON_POST"
  | "REPLY_TO_COMMENT"
  | "REACTION_ON_POST";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  actor: { id: string; name: string; image: string | null };
  postId: string | null;
  commentId: string | null;
  message: string;
  href: string;
};

export type NotificationPage = {
  items: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
};
