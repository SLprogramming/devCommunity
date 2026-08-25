"use client";

import { useEffect } from "react";
import { recordPostViewAction } from "@/feature/post/actions";

export default function PostViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    if (!postId) return;

    recordPostViewAction({ postId }).catch((err) => {
      console.error("Failed to record post view:", err);
    });
  }, [postId]);

  return null;
}
