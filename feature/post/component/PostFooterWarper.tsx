import {
  getPostCommentsCount,
  getPostReactions,
  getPostSharesCount,
  type PostWithReactions,
} from "@/feature/post/queries";

import { PostFooter } from "./PostFooter";

export default async function PostFooterWarper({ postId }: { postId: string }) {
  const postReaction = await getPostReactions(postId);
  const shareCount = await getPostSharesCount(postId);
  const commentCount = await getPostCommentsCount(postId);
  return (
    <>
      <PostFooter
        initialData={{
          postId: postId,
          reactions: postReaction.map((react) => ({
            type: react?.type,
            userId: react?.userId,
          })),
          comments: commentCount,
          share: shareCount,
        }}
      />
    </>
  );
}
