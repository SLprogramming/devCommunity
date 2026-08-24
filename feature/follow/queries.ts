"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

export type NetworkUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  jobTitle?: string;
  address?: string;
  isFollowing: boolean;
  isSelf: boolean;
};

// Cached internal fetcher for followers
async function fetchFollowersCached(
  targetUserId: string,
  currentUserId?: string,
): Promise<NetworkUser[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`user-followers-${targetUserId}`);

  const followersData = await prisma.follow.findMany({
    where: {
      followingId: targetUserId,
    },
    select: {
      follower: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: {
            select: {
              jobTitle: true,
              address: true,
            },
          },
          ...(currentUserId && {
            followers: {
              where: {
                followerId: currentUserId,
              },
              select: {
                followerId: true,
              },
            },
          }),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return followersData.map(({ follower }) => ({
    id: follower.id,
    name: follower.name ?? "Anonymous",
    email: follower.email,
    image: follower.image ?? undefined,
    jobTitle: follower.profile?.jobTitle ?? undefined,
    address: follower.profile?.address ?? undefined,
    isFollowing: currentUserId ? (follower.followers?.length ?? 0) > 0 : false,
    isSelf: currentUserId === follower.id,
  }));
}

// Cached internal fetcher for following
async function fetchFollowingCached(
  targetUserId: string,
  currentUserId?: string,
): Promise<NetworkUser[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`user-following-${targetUserId}`);
  console.log("following data get");
  const followingData = await prisma.follow.findMany({
    where: {
      followerId: targetUserId,
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: {
            select: {
              jobTitle: true,
              address: true,
            },
          },
          ...(currentUserId && {
            followers: {
              where: {
                followerId: currentUserId,
              },
              select: {
                followerId: true,
              },
            },
          }),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return followingData.map(({ following }) => ({
    id: following.id,
    name: following.name ?? "Anonymous",
    email: following.email,
    image: following.image ?? undefined,
    jobTitle: following.profile?.jobTitle ?? undefined,
    address: following.profile?.address ?? undefined,
    isFollowing: currentUserId ? (following.followers?.length ?? 0) > 0 : false,
    isSelf: currentUserId === following.id,
  }));
}

// Exported actions called by client/server components
export const getFollowers = async (userId: string): Promise<NetworkUser[]> => {
  const session = await getSession();
  const currentUserId = session?.user?.id;
  return fetchFollowersCached(userId, currentUserId);
};

export const getFollowing = async (
  userId: string,
): Promise<NetworkUser[] | null> => {
  const session = await getSession();
  const currentUserId = session?.user?.id;
  if (currentUserId !== userId) return null;
  return fetchFollowingCached(userId, currentUserId);
};
