"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";

type ActionResponse = {
  success: boolean;
  message: string;
  isFollowing?: boolean;
  error?: string;
};

export const followUserAction = async (
  userId: string,
): Promise<ActionResponse> => {
  try {
    const session = await getSession();

    // 1. Verify Authentication
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized",
        error: "You must be logged in to manage follows.",
      };
    }

    const currentUserId = session.user.id;

    // 2. Prevent self-following
    if (currentUserId === userId) {
      return {
        success: false,
        message: "Invalid action",
        error: "You cannot follow yourself.",
      };
    }

    // 3. Check if the follow relation already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId,
          },
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath(`/profile/${currentUserId}`);
      updateTag(`user-profile-${userId}`);
      updateTag(`user-profile-${currentUserId}`);

      return {
        success: true,
        message: "Successfully unfollowed user.",
        isFollowing: false,
      };
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath(`/profile/${currentUserId}`);
      updateTag(`user-profile-${userId}`);
      updateTag(`user-profile-${currentUserId}`);

      return {
        success: true,
        message: "Successfully followed user.",
        isFollowing: true,
      };
    }
  } catch (error: any) {
    console.error("Error in followUserAction:", error);

    return {
      success: false,
      message: "Server Error",
      error: "Something went wrong. Please try again.",
    };
  }
};

export async function getIsFollowingAction(
  targetUserId: string,
): Promise<boolean> {
  const session = await getSession();
  const currentUserId = session?.user?.id;

  if (!currentUserId || currentUserId === targetUserId) return false;

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
    select: { followerId: true },
  });

  return !!follow;
}
