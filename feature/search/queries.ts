import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;

export function isValidSearchQuery(q: string | undefined | null): boolean {
  return Boolean(q && q.trim().length >= MIN_QUERY_LENGTH);
}

export async function searchPosts(q: string, take = 10) {
  const term = q.trim();
  if (term.length < MIN_QUERY_LENGTH) return [];

  return prisma.post.findMany({
    where: {
      published: true,
      OR: [
        { caption: { contains: term, mode: "insensitive" } },
        { content: { contains: term, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      caption: true,
      content: true,
      createdAt: true,
      imageUrl: true,
      author: {
        select: { id: true, name: true, image: true },
      },
      _count: { select: { comments: true, reactions: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function searchUsers(q: string, take = 10) {
  const term = q.trim();
  if (term.length < MIN_QUERY_LENGTH) return [];

  return prisma.user.findMany({
    where: {
      name: { contains: term, mode: "insensitive" },
    },
    select: {
      id: true,
      name: true,
      image: true,
      profile: {
        select: { jobTitle: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function searchTags(q: string, take = 10) {
  const term = q.trim();
  if (term.length < MIN_QUERY_LENGTH) return [];

  return prisma.hashtag.findMany({
    where: {
      name: { contains: term, mode: "insensitive" },
    },
    select: {
      id: true,
      name: true,
      _count: { select: { posts: true } },
    },
    orderBy: {
      posts: { _count: "desc" },
    },
    take,
  });
}
