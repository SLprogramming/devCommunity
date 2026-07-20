"use cache";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export const getAllPosts = async () => {
  cacheLife("hours");
  cacheTag("posts");

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      hashtags: true,
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
    },
  });

  return post;
};
