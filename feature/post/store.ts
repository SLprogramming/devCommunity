import { create } from "zustand";

export type QueueItem = {
  id: string;
  caption?: string;
  content?: string;
  imagePreview?: string | null;
  hashtags: string[];
  status: "pending" | "failed";
  user: {
    name?: string | null;
    image?: string | null;
  };
};

type PostQueueStore = {
  queue: QueueItem[];
  addPost: (post: QueueItem) => void;
  removePost: (id: string) => void;
  changeStatus: (id: string, status: QueueItem["status"]) => void;
};

export const usePostQueue = create<PostQueueStore>((set) => ({
  queue: [],
  addPost: (post) => set((state) => ({ queue: [post, ...state.queue] })),
  removePost: (id) =>
    set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
  changeStatus: (id, status) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    })),
}));
