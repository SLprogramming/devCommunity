"use server";
import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";

export interface TechStackItem {
  id: string;
  name: string;
}

export interface ProfileData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  bannerUrl: string | null;
  address: string | null;
  githubLink: string | null;
  jobTitle: string | null;
  bio: string | null;
  techStack: TechStackItem[];
}

export interface UserProfileData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  role: string;
  profile: ProfileData | null;
}

// Full return type (can be null if unauthenticated/not found)
export type UserProfile = UserProfileData | null;

export const getPopularUserIds = async () => {
  try {
    const posts = await prisma.user.findMany({
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
};

export const getUserProfile = async (userId: string) => {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const result = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          techStack: true,
        },
      },
      followers: true,
      following: true,
    },
  });

  return result;
};

export const getUserProfilePromise = async (id: string) => {
  const session = await getSession();
  if (!session?.user?.id) {
    return null;
  }
  return getUserProfile(session?.user?.id);
};
