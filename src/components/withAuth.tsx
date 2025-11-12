"use client";

import { useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

/**
 * Higher Order Component for protecting routes that require authentication
 * @param Component - The component to wrap
 * @param redirectTo - The path to redirect to if not authenticated (default: "/auth")
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  redirectTo: string = "/auth"
) {
  return function ProtectedRoute(props: P) {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push(redirectTo);
      }
    }, [user, router]);

    // Don't render component until user is confirmed
    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };
}
