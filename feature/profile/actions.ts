"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { put, del } from "@vercel/blob";
import { connection } from "next/server";
import { ToastType } from "@/hooks/use-action-toast";

export type CreateProfileActionPayload = {
  id: string;
  name: string;
  jobTitle: string;
  address: string;
  githubLink: string;
  bio: string;
  techStack: string[];
};

export type InitialState = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
  toast?: ToastType;
  redirectTo?: string;
};

export const createProfileAction = async (id: string) => {
  try {
    await prisma.profile.create({
      data: {
        userId: id,
      },
    });
    updateTag(`user-profile-${id}`);
  } catch (error) {}
};

export const createOrGetTagAction = async (name: string) => {
  try {
    await connection();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: "Tag name cannot be empty" };
    }

    // Upsert ensures no duplicate tags if two users type the same skill
    const tag = await prisma.tag.upsert({
      where: {
        name: cleanName,
      },
      update: {}, // If it already exists, do nothing and just return it
      create: {
        name: cleanName,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return { success: true, data: tag };
  } catch (error) {
    console.error("Failed to create/get tech stack tag:", error);
    return { success: false, error: "Failed to process tag" };
  }
};

export const searchTagsAction = async (name: string) => {
  try {
    const trimmedQuery = name.trim();

    // Short-circuit if query is empty
    if (!trimmedQuery) {
      return { success: true, data: [] };
    }

    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: trimmedQuery,
          mode: "insensitive", // Matches "react", "React", "REACT"
        },
      },
      take: 8, // Keeps autocomplete payload fast and small
      select: {
        id: true,
        name: true,
      },
    });

    return { success: true, data: tags };
  } catch (error) {
    console.error("Failed to search tech stack tags:", error);
    return { success: false, data: [], error: "Failed to search tags" };
  }
};

export const updateProfile = async (
  prevState: InitialState,
  payload: FormData | { type: "RESET" },
): Promise<InitialState> => {
  try {
    if (payload && "type" in payload && payload.type === "RESET") {
      return {
        success: false,
        message: "",
      };
    }
    const formData = payload as FormData;
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const address = formData.get("address") as string;
    const githubLink = formData.get("githubLink") as string;
    const bio = formData.get("bio") as string;
    const techStack = JSON.parse(
      formData.get("techStack") as string,
    ) as string[];
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | undefined;

    // 1. Handle Vercel Blob upload if an avatar file was provided
    if (avatarFile && avatarFile.size > 0) {
      // Fetch current user image URL from DB
      const existingUser = await prisma.user.findUnique({
        where: { id },
        select: { image: true },
      });

      // Upload the new image
      const blob = await put(
        `avatars/${id}-${Date.now()}.${avatarFile.name.split(".").pop()}`,
        avatarFile,
        {
          access: "public",
        },
      );
      avatarUrl = blob.url;

      // Delete old image from Vercel Blob if it exists and is a Vercel Blob URL
      if (
        existingUser?.image &&
        existingUser.image.includes("vercel-storage.com")
      ) {
        await del(existingUser.image);
      }
    }

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      // Update the name and image on the User model
      prisma.user.update({
        where: { id },
        data: { name, ...(avatarUrl && { image: avatarUrl }) },
      }),

      // Update the rest of the fields on the Profile model
      prisma.profile.update({
        where: { userId: id },
        data: {
          jobTitle,
          address,
          githubLink,
          bio,
          techStack: {
            set: techStack.map((tagId) => ({ id: tagId })),
          },
        },
        include: {
          techStack: true,
        },
      }),
    ]);

    updateTag(`user-profile-${id}`);
    revalidatePath(`/profile/${id}`);

    return {
      success: true,
      data: { user: updatedUser, profile: updatedProfile },
      message: "Profile updated successfully",
      redirectTo: `/profile/${id}`,
      toast: {
        type: "success",
        message: "Profile updated successfully",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error("Failed to update profile:", error);

    return {
      success: false,
      message: "failed to update profile",
      toast: {
        type: "error",
        message: "failed to update profile",
        timestamp: Date.now(),
      },
    };
  }
};
