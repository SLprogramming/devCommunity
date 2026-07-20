"use server";
import { cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    },
  });

  return result;
};

export const getUserProfilePromise = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return null;
  }
  return getUserProfile(session?.user?.id);
};
