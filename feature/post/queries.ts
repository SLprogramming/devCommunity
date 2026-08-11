"use cache";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getAllPosts = async () => {
  cacheLife("hours");
  cacheTag("posts");
  console.log("getting all post");
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      hashtags: true,
      comments: {
        include: {
          replies: true,
        },
      },
      reactions: true,
      shares: true,
    },
  });
  return posts;
};

export async function getPopularPostIds() {
  try {
    const posts = await prisma.post.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    return posts.map((post) => String(post.id));
  } catch (error) {
    console.error("Failed to fetch popular post IDs:", error);
    // Fallback array to prevent build crashes if database is unreachable during build
    return ["1", "2", "3"];
  }
}

export const getPostDetailWithId = async (id: string) => {
  cacheLife("days");
  cacheTag(`post-${id}`);

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        include: {
          profile: true,
        },
      },
      hashtags: true,
      comments: true,
      reactions: true,
      shares: true,
    },
  });

  return post;
};

export const getPostReactions = async (id: string) => {
  "use cache";
  cacheLife("hours");
  cacheTag(`post-reactions-${id}`);

  return prisma.reaction.findMany({
    where: { postId: id },
    select: { userId: true, type: true }, // Lightweight query!
  });
};

export async function getPostComments(postId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`post-comments-${postId}`);

  return prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
    },
  });
}

export async function getPostCommentsCount(postId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`post-comments-${postId}`);

  return prisma.comment.count({
    where: { postId },
  });
}

export async function getPostSharesCount(postId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`post-shares-${postId}`);

  return prisma.share.count({
    where: { postId },
  });
}

export async function getTotalPostsByUserId(authorId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`user-posts-${authorId}`);

  return prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      comments: true,
      reactions: true,
    },
  });
}

export async function getTotalCommentsByUserId(authorId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`user-comments-${authorId}`);

  return prisma.comment.findMany({
    where: {
      authorId,
    },
  });
}

export type PostArrayWithReactions = Awaited<ReturnType<typeof getAllPosts>>;

export type PostWithReactions = PostArrayWithReactions[number];

export type PostCommentsArray = Awaited<ReturnType<typeof getPostComments>>;

export type PostComment = PostCommentsArray[number];

export type UserPostsArray = Awaited<ReturnType<typeof getTotalPostsByUserId>>;

export type UserPost = UserPostsArray[number];

export type UserCommentsArray = Awaited<
  ReturnType<typeof getTotalCommentsByUserId>
>;

export type UserComment = UserCommentsArray[number];
