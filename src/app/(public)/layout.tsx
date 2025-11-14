"use client";

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    // Exception: allow access to certain pages like verify-email
    if (!isLoading && user) {
      const currentPath = window.location.pathname;
      // Don't redirect from verify-email or other necessary public pages
      if (
        !currentPath.includes("verify-email") &&
        !currentPath.includes("reset-password")
      ) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  return <>{children}</>;
}
