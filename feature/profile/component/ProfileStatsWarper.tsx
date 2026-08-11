"use cache";
import {
  getTotalCommentsByUserId,
  getTotalPostsByUserId,
} from "@/feature/post/queries";
import React from "react";
import ProfileStats from "./ProfileStats";
import { cacheTag } from "next/cache";

const ProfileStatsWarper = async ({ id }: { id: string }) => {
  const userPosts = await getTotalPostsByUserId(id);
  const totalCommentsList = await getTotalCommentsByUserId(id);

  // --- ProfileStats Calculations ---
  const postsCount = userPosts.length;

  const totalLikes = userPosts
    .flatMap((post) => post.reactions)
    .filter((r) => r.type === "LIKE").length;

  const discussionsCount = totalCommentsList.length;

  // Format Top 5 Recent Posts
  const recentPosts = [...userPosts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((post) => ({
      id: post.id,
      caption: post.caption,
      content: post.content,
      createdAt: post.createdAt,
      reactionsCount: post.reactions.length,
      commentsCount: post.comments.length,
    }));

  // Format Top 10 User Comments
  const recentComments = totalCommentsList
    .filter((comment) => comment?.authorId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)
    .map((comment) => ({
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
    }));
  id;
  return (
    <ProfileStats
      stats={{
        postsCount,
        totalLikes,
        discussionsCount,
      }}
      recentPosts={recentPosts}
      recentComments={recentComments}
    />
  );
};

export default ProfileStatsWarper;
