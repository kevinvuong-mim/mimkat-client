"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, XCircle, CheckCircle2 } from "lucide-react";

import { useI18n } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export default function VerifyEmailPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const { error, isLoading, isSuccess } = useQuery({
    enabled: Boolean(searchParams.get("token")),
    queryKey: ["verifyEmail", searchParams.get("token")],
    queryFn: () => authService.verifyEmail(searchParams.get("token") || ""),
  });

  useEffect(() => {
    if (!isSuccess) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, isSuccess]);

  useEffect(() => {
    if (countdown === 0) router.push("/login");
  }, [countdown]);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t.verifyEmail.loading}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.verifyEmail.verifying}
            </p>
          </div>
        ) : error ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
              {t.verifyEmail.error}
            </h2>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <div className="pt-4 space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">{t.verifyEmail.backToLogin}</Link>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
              {t.verifyEmail.success}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.verifyEmail.successMessage}
            </p>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-sm font-medium">
                {t.verifyEmail.redirectingIn.replace(
                  "{countdown}",
                  countdown.toString()
                )}
              </p>
            </div>
            <div className="pt-4 space-y-3">
              <Button asChild className="w-full">
                <Link href="/login">{t.verifyEmail.loginNow}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t.verifyEmail.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.verifyEmail.checkEmailLink}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
