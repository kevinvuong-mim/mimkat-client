import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { ChangePasswordData } from "@/types/session";

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
    onSuccess: () => {
      // Invalidate user-related queries after successful password change
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error) => {
      console.error("Change password error:", error);
    },
  });
}

export function useGetSessions() {
  return useMutation({
    mutationFn: (refreshToken?: string) =>
      userService.getSessions(refreshToken),
  });
}
