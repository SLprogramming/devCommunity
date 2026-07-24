"use server";

import { revalidatePath, updateTag } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma"; // Adjust import according to your Prisma client path
import { type ToastType } from "@/hooks/use-action-toast";
import { type ReactionType } from "@/app/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { success } from "zod";
import { getSession } from "@/lib/get-session";
export type InitialState = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
  toast?: ToastType;
  redirectTo?: string;
};

export type WriteCommentInput = {
  postId: string;
  content: string;
  parentId?: string | null;
};
export const createPostAction = async (
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
      message: "Your post is now live!",
      data: newPost,
      toast: {
        type: "success",
        message: "Your post is now live!",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error("Error on create post: ", error);

    return {
      success: false,
      message: "Failed to publish post.",
      error: error instanceof Error ? error.message : "Unknown error",
      toast: {
        type: "error",
        message: "Failed to publish post. Please try again.",
        timestamp: Date.now(),
      },
    };
  }
};

export const reactPostAction = async ({
  postId,
  reactionType,
}: {
  postId: string;
  reactionType: ReactionType | null;
}) => {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  if (!postId) {
    return {
      message: "Post ID cannot be null.",
      success: false,
    };
  }

  try {
    // 1. Check if user has an existing reaction for this post
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    // 2. TOGGLE OFF / DELETE: User clicked same reaction or sent null
    if (
      existingReaction &&
      (reactionType === null || existingReaction.type === reactionType)
    ) {
      await prisma.reaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
      updateTag(`post-reactions-${postId}`);
      return {
        success: true,
        action: "REMOVED",
        message: "Reaction removed.",
      };
    }

    // 3. UPDATE: User changes reaction type (e.g. LIKE -> LOVE)
    if (existingReaction && reactionType) {
      const updatedReaction = await prisma.reaction.update({
        where: {
          id: existingReaction.id,
        },
        data: {
          type: reactionType,
        },
      });
      updateTag(`post-reactions-${postId}`);

      return {
        success: true,
        action: "UPDATED",
        reaction: updatedReaction,
        message: "Reaction updated.",
      };
    }

    // 4. CREATE: First-time reaction from user
    if (reactionType) {
      const newReaction = await prisma.reaction.create({
        data: {
          userId,
          postId,
          type: reactionType,
        },
      });
      updateTag(`post-reactions-${postId}`);

      return {
        success: true,
        action: "CREATED",
        reaction: newReaction,
        message: "Reaction added.",
      };
    }

    return {
      success: false,
      message: "Invalid action or missing reaction type.",
    };
  } catch (error) {
    console.error("Error toggling post reaction:", error);
    return {
      success: false,
      message: "Something went wrong while processing your reaction.",
    };
  }
};

export const writeCommentAction = async ({
  postId,
  content,
  parentId,
}: WriteCommentInput) => {
  try {
    // 1. Authenticate session
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to leave a comment.",
      };
    }

    const authorId = session.user.id;

    // 2. Validate input strings
    const trimmedContent = content?.trim();
    if (!postId || !trimmedContent) {
      return {
        success: false,
        message: "Post ID and comment content are required.",
      };
    }

    // 3. Ensure post exists
    const postExists = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!postExists) {
      return {
        success: false,
        message: "The post you are commenting on does not exist.",
      };
    }

    // 4. If this is a reply, ensure parent comment exists on the same post
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return {
          success: false,
          message: "Invalid parent comment.",
        };
      }
    }

    // 5. Create the comment
    const newComment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        postId,
        authorId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 6. Purge Next.js cache for post comments & counts
    updateTag(`post-comments-${postId}`);

    return {
      success: true,
      comment: newComment,
      message: parentId ? "Reply added." : "Comment added.",
    };
  } catch (error) {
    console.error("Error writing comment:", error);
    return {
      success: false,
      message: "Something went wrong while posting your comment.",
    };
  }
};
