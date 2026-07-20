"use server";

import { revalidatePath, updateTag } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma"; // Adjust import according to your Prisma client path
import { type ToastType } from "@/hooks/use-action-toast";

export type InitialState = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
  toast?: ToastType;
  redirectTo?: string;
};

export const createPostAction = async (
  prevState: InitialState,
  payload: FormData | { type: "RESET" },
): Promise<InitialState> => {
  try {
    // Handle Reset Action
    if (
      !(payload instanceof FormData) &&
      "type" in payload &&
      payload.type === "RESET"
    ) {
      return {
        success: false,
        message: "",
      };
    }

    const formData = payload as FormData;
    const authorId = formData.get("authorId") as string;
    const caption = (formData.get("caption") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || null;
    const hashTagsRaw = formData.get("hashtags") as string;
    const hashTags: string[] = hashTagsRaw ? JSON.parse(hashTagsRaw) : [];
    const image = formData.get("image") as File | null;

    // 1. Basic Payload Validation
    if (!authorId) {
      return {
        success: false,
        message: "Unauthorized or missing author ID.",
        toast: {
          type: "error",
          message: "Author identification required.",
          timestamp: Date.now(),
        },
      };
    }

    if (!content && !caption && (!image || image.size === 0)) {
      return {
        success: false,
        message: "Post cannot be empty.",
        toast: {
          type: "warning",
          message: "Please write something or upload an image.",
          timestamp: Date.now(),
        },
      };
    }

    // 2. Upload Image to Vercel Blob (if image exists and has content)
    let imageUrl: string | null = null;
    if (image && image.size > 0) {
      const blob = await put(`posts/${Date.now()}-${image.name}`, image, {
        access: "public",
      });
      imageUrl = blob.url;
    }

    // Clean and deduplicate tags
    const cleanTags = Array.from(
      new Set(
        hashTags
          .map((tag) => tag.toLowerCase().trim().replace(/^#/, "")) // strip leading '#' if present
          .filter(Boolean),
      ),
    );

    // 3. Save Post & Link/Create Hashtags in Database atomically
    const newPost = await prisma.post.create({
      data: {
        authorId,
        caption,
        content,
        imageUrl,
        hashtags: {
          connectOrCreate: cleanTags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        hashtags: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 4. Revalidate Feed Page
    revalidatePath("/");
    updateTag("posts");
    return {
      success: true,
      message: "Post created successfully",
      data: newPost,
      toast: {
        type: "success",
        message: "Your post is now live!",
        timestamp: Date.now(),
      },
      redirectTo: "/",
    };
  } catch (error) {
    console.error("Error on create post: ", error);

    return {
      success: false,
      message: "Failed to create post",
      error: error instanceof Error ? error.message : "Unknown error",
      toast: {
        type: "error",
        message: "Failed to publish post. Please try again.",
        timestamp: Date.now(),
      },
    };
  }
};
