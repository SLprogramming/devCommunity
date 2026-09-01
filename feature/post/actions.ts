"use server";

import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma"; // Adjust import according to your Prisma client path
import { type ToastType } from "@/hooks/use-action-toast";
import { type ReactionType } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { getPostViews, getPostReactions } from "@/feature/post/queries";
export type InitialState = {
  success: boolean;
  message: string;
  error?: string;
  data?: unknown;
  toast?: ToastType;
  redirectTo?: string;
};

export type TogglePublishPostInput = {
  postId: string;
  published?: boolean;
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
    const session = await getSession();
    const formData = payload as FormData;
    const authorId = session?.user?.id;
    const caption = (formData.get("caption") as string)?.trim() || null;
    const content = (formData.get("content") as string)?.trim() || null;
    const hashTagsRaw = formData.get("hashtags") as string;
    const hashTags: string[] = hashTagsRaw ? JSON.parse(hashTagsRaw) : [];
    const image = formData.get("image") as File | null;

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

    // 2. Image Size Check (Max 2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
    if (image && image.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "Image size exceeds the 2 MB limit.",
        toast: {
          type: "error",
          message: "Image is too large. Maximum allowed size is 2 MB.",
          timestamp: Date.now(),
        },
      };
    }

    // 3. Upload Image to Vercel Blob (if image exists and has content)
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

    // 4. Save Post & Link/Create Hashtags in Database atomically
    const newPost = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
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
      await tx.notificationEvent.create({
        data: {
          type: "NEW_POST_FROM_FOLLOWING",
          actorId: authorId,
          postId: post.id,
        },
      });
      return post;
    });

    // 5. Revalidate Feed Page
    revalidatePath("/");
    updateTag("posts");
    updateTag(`user-posts-${authorId}`);
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
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      authorId: true,
    },
  });

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
      updateTag(`user-posts-${post?.authorId}`);
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
      updateTag(`user-posts-${post?.authorId}`);
      return {
        success: true,
        action: "UPDATED",
        reaction: updatedReaction,
        message: "Reaction updated.",
      };
    }

    // 4. CREATE: First-time reaction from user
    if (reactionType) {
      const newReaction = await prisma.$transaction(async (tx) => {
        const reaction = await tx.reaction.create({
          data: {
            userId,
            postId,
            type: reactionType,
          },
        });
        if (post?.authorId && post.authorId !== userId) {
          await tx.notificationEvent.create({
            data: {
              type: "REACTION_ON_POST",
              actorId: userId,
              recipientId: post.authorId,
              postId,
              reactionId: reaction.id,
            },
          });
        }
        return reaction;
      });
      updateTag(`post-reactions-${postId}`);
      updateTag(`user-posts-${post?.authorId}`);
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
      select: { id: true, authorId: true },
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
        select: { id: true, postId: true, authorId: true },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return {
          success: false,
          message: "Invalid parent comment.",
        };
      }
    }

    // 5. Create the comment
    const recipientId = parentId
      ? (
          await prisma.comment.findUnique({
            where: { id: parentId },
            select: { authorId: true },
          })
        )?.authorId
      : postExists.authorId;

    const newComment = await prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
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
      if (recipientId && recipientId !== authorId) {
        await tx.notificationEvent.create({
          data: {
            type: parentId ? "REPLY_TO_COMMENT" : "COMMENT_ON_POST",
            actorId: authorId,
            recipientId,
            postId,
            commentId: comment.id,
          },
        });
      }
      return comment;
    });

    // 6. Purge Next.js cache for post comments & counts

    revalidatePath(`/profile/${postExists.authorId}`);
    updateTag(`post-comments-${postId}`);
    updateTag(`user-posts-${postExists.authorId}`);
    updateTag(`user-comments-${postExists.authorId}`);

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

export type DeletePostInput = {
  postId: string;
};

export const deletePostAction = async ({
  postId,
}: DeletePostInput): Promise<InitialState> => {
  try {
    // 1. Authenticate session
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
        toast: {
          type: "error",
          message: "You must be logged in to delete a post.",
          timestamp: Date.now(),
        },
      };
    }

    if (!postId) {
      return {
        success: false,
        message: "Post ID is required.",
      };
    }

    // 2. Fetch post to check ownership & get imageUrl
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        imageUrl: true,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found.",
        toast: {
          type: "error",
          message: "Post not found or already deleted.",
          timestamp: Date.now(),
        },
      };
    }

    // 3. Authorization Check: Only author can delete
    if (post.authorId !== session.user.id) {
      return {
        success: false,
        message: "Forbidden. You can only delete your own posts.",
        toast: {
          type: "error",
          message: "You do not have permission to delete this post.",
          timestamp: Date.now(),
        },
      };
    }

    // 4. Delete associated image from Vercel Blob if present
    if (post.imageUrl) {
      try {
        await del(post.imageUrl);
      } catch (blobError) {
        // Log blob error but continue deleting record from DB
        console.error("Failed to delete image from Vercel Blob:", blobError);
      }
    }

    // 5. Delete post from database
    await prisma.post.delete({
      where: { id: postId },
    });

    // 6. Purge Cache & Tags
    revalidatePath("/");
    revalidatePath(`/profile/${post.authorId}`, "layout");
    updateTag("posts");
    updateTag(`user-posts-${post.authorId}`);
    updateTag(`post-comments-${postId}`);
    updateTag(`post-reactions-${postId}`);

    return {
      success: true,
      message: "Post deleted successfully.",
      toast: {
        type: "success",
        message: "Post has been deleted.",
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message: "Failed to delete post.",
      error: error instanceof Error ? error.message : "Unknown error",
      toast: {
        type: "error",
        message: "Something went wrong while deleting the post.",
        timestamp: Date.now(),
      },
    };
  }
};

export const togglePublishPostAction = async ({
  postId,
  published,
}: TogglePublishPostInput): Promise<InitialState> => {
  try {
    // 1. Authenticate Session
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
        toast: {
          type: "error",
          message: "You must be logged in to modify post status.",
          timestamp: Date.now(),
        },
      };
    }

    if (!postId) {
      return {
        success: false,
        message: "Post ID is required.",
      };
    }

    // 2. Fetch Post to Verify Ownership & Get Current Published State
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        published: true,
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found.",
        toast: {
          type: "error",
          message: "Post not found.",
          timestamp: Date.now(),
        },
      };
    }

    // 3. Ownership Check
    if (post.authorId !== session.user.id) {
      return {
        success: false,
        message: "Forbidden. You can only update your own posts.",
        toast: {
          type: "error",
          message: "You do not have permission to update this post.",
          timestamp: Date.now(),
        },
      };
    }

    // Determine target published state (toggle if boolean not explicitly supplied)
    const nextPublishedState =
      typeof published === "boolean" ? published : !post.published;

    // 4. Update Database Record
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        published: nextPublishedState,
      },
    });

    // 5. Purge Cache & Revalidate Tags
    revalidatePath("/");
    revalidatePath(`/post/${postId}`);
    revalidatePath(`/profile/${post.authorId}`, "layout");
    updateTag("posts");
    updateTag(`post-${postId}`);
    updateTag(`user-posts-${post.authorId}`);

    const actionText = nextPublishedState ? "published" : "unpublished";

    return {
      success: true,
      message: `Post successfully ${actionText}.`,
      data: updatedPost,
      toast: {
        type: "success",
        message: `Post has been ${actionText}.`,
        timestamp: Date.now(),
      },
    };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    return {
      success: false,
      message: "Failed to update publish status.",
      error: error instanceof Error ? error.message : "Unknown error",
      toast: {
        type: "error",
        message: "Something went wrong while updating the post status.",
        timestamp: Date.now(),
      },
    };
  }
};

const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day device session

export const getPostViewsAction = async ({ postId }: { postId: string }) => {
  try {
    return await getPostViews(postId);
  } catch (error) {
    console.error("Error fetching post views:", error);
    return 0;
  }
};

export const getPostReactionsAction = async ({
  postId,
}: {
  postId: string;
}) => {
  try {
    return await getPostReactions(postId);
  } catch (error) {
    console.error("Error fetching post reactions:", error);
    return [];
  }
};

export const recordPostViewAction = async ({ postId }: { postId: string }) => {
  try {
    if (!postId) {
      return { success: false, counted: false };
    }

    const cookieStore = await cookies();
    const viewCookieName = `viewed_${postId}`;

    // Already viewed on this device within the last 24h
    if (cookieStore.get(viewCookieName)) {
      return { success: true, counted: false };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    cookieStore.set(viewCookieName, "1", {
      maxAge: VIEW_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });

    return { success: true, counted: true };
  } catch (error) {
    console.error("Error recording post view:", error);
    return { success: false, counted: false };
  }
};
