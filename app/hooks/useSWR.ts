// Custom SWR hooks for data fetching
import useSWR from "swr";
import { SWR_KEYS } from "@/app/lib/swr";
import type { EssentialComment, FullPost } from "@/app/lib/definitions";

// Hook for fetching a single post
export function usePost(postId: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    postId ? SWR_KEYS.POST(postId) : null
  );

  return {
    post: data as FullPost | undefined,
    isLoading,
    error,
    mutate,
    refresh: () => mutate(),
  };
}

// Hook for fetching a single comment
export function useComment(commentId: string | null) {
  const { data, error, mutate, isLoading } = useSWR(
    commentId ? SWR_KEYS.COMMENT(commentId) : null
  );

  return {
    comment: data as EssentialComment | undefined,
    isLoading,
    error,
    mutate,
    refresh: () => mutate(),
  };
}

// Hook for fetching comment replies with pagination
export function useCommentReplies(commentId: string | null, cursor?: string) {
  const key = commentId
    ? `${SWR_KEYS.COMMENT_REPLIES(commentId)}${
        cursor ? `?cursor=${cursor}` : ""
      }`
    : null;

  const { data, error, mutate, isLoading } = useSWR(key);

  return {
    replies: (data?.replies || []) as EssentialComment[],
    nextCursor: data?.nextCursor as string | null,
    isLoading,
    error,
    mutate,
    refresh: () => mutate(),
  };
}

// Hook for optimistic comment updates
export function useOptimisticComments(
  initialComments: EssentialComment[] = []
) {
  const { data, mutate } = useSWR("optimistic-comments", null, {
    fallbackData: initialComments,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });

  const addComment = (newComment: EssentialComment) => {
    mutate([newComment, ...(data || [])], false);
  };

  const updateComment = (
    commentId: string,
    updatedComment: Partial<EssentialComment>
  ) => {
    const updated = (data || []).map((comment: EssentialComment) =>
      comment?.id === commentId ? { ...comment, ...updatedComment } : comment
    );
    mutate(updated, false);
  };

  const removeComment = (commentId: string) => {
    const filtered = (data || []).filter(
      (comment: EssentialComment) => comment?.id !== commentId
    );
    mutate(filtered, false);
  };

  return {
    comments: data || [],
    addComment,
    updateComment,
    removeComment,
    refresh: () => mutate(),
  };
}
