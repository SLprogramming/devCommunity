import {
  getPostCommentsCount,
  getPostReactions,
  getPostSharesCount,
  type PostWithReactions,
} from "@/feature/post/queries";

import { PostFooter } from "./PostFooter";

export default async function PostFooterWarper({
  postId,
  userId,
}: {
  postId: string;
  userId: string | null;
}) {
  const postReaction = await getPostReactions(postId);
  const shareCount = await getPostSharesCount(postId);
  const commentCount = await getPostCommentsCount(postId);
  const userReaction = postReaction?.find((item) => item?.userId == userId);
  return (
    <>
      <PostFooter
        initialData={{
          userId: userId || null,
          postId: postId,
          userReaction: userReaction?.type || null,
          reactions: postReaction.map((react) => react?.type),
          comments: commentCount,
          share: shareCount,
        }}
      />
    </>
  );
}
