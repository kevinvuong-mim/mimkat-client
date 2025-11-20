"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const { error, isSuccess, isLoading } = useQuery({
    enabled: Boolean(searchParams.get("token")),
    queryKey: ["verifyEmail", searchParams.get("token")],
    queryFn: () => authService.verifyEmail(searchParams.get("token") || ""),
  });

  useEffect(() => {
    if (!isSuccess) return;

    // Start countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess]);

  return isLoading ? (
    <p>{t.common.loading}</p>
  ) : error ? (
    <p>
      {t.common.error}: {error.message}
    </p>
  ) : isSuccess ? (
    <p>
      {t.common.success} —{" "}
      {t.common.redirectingIn.replace("{countdown}", countdown.toString())}
    </p>
  ) : (
    "Verify email page"
  );
}
