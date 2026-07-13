// hooks/use-action-toast.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ActionState {
  toast?: ToastType;
  redirectTo?: string;
}

export type ToastType = {
  message?: string;
  type?: "success" | "info" | "warning" | "error";
  timestamp?: number;
};

export function useActionToast(state: ActionState) {
  const router = useRouter();

  useEffect(() => {
    if (!state?.toast?.message) return;

    if (state.toast.type) {
      toast[state.toast.type](state.toast.message);
    } else {
      toast(state.toast.message);
    }

    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state?.toast?.timestamp, state?.toast, state?.redirectTo, router]);
}
