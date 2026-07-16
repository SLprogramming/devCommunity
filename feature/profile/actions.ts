"use server"
import { prisma } from "@/lib/prisma";
import { revalidateTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export type CreateProfileActionPayload = {id:string,name:string,jobTitle:string,address:string,githubLink:string,bio:string,techStack:string[]}

export const createProfileAction = async (id:string) => {
  try {
     await prisma.profile.create({
          data:{
            userId: id ,
          }
        })
        updateTag(`user-profile-${id}`);
  } catch (error) {
    
  }
}

export const createOrGetTagAction = async (name: string) => {
  try {
    await connection()
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

export const updateProfile = async ({
  id,
  name,
  jobTitle,
  address,
  githubLink,
  bio,
  techStack,
}: CreateProfileActionPayload) => {
  try {
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      // 1. Update the name on the User model
      prisma.user.update({
        where: { id },
        data: { name },
      }),

      // 2. Update the rest of the fields on the Profile model
      prisma.profile.update({
        where: { userId: id }, // Adjust field name if your foreign key differs (e.g., id or profileId)
        data: {
          jobTitle,
          address,
          githubLink,
          bio,
            techStack: {
                set: techStack.map((tagId) => ({ id: tagId })),
            }
        },
        include:{
            techStack:true
        }
      }),
    ]);
    updateTag(`user-profile-${id}`);
    // return { success: true, user: updatedUser, profile: updatedProfile };
  } catch (error) {
    console.error("Failed to update profile:", error);

    return { success: false, error: "Unable to update profile. Please try again." };
  }
  redirect("/profile")
};