"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(t.auth.invalidToken);
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || t.auth.emailVerifiedSuccessfully);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || t.auth.verificationError);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            )}
            {status === "error" && (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl text-center">
            {status === "loading" && t.auth.verifyingEmail}
            {status === "success" && t.auth.verificationSuccess}
            {status === "error" && t.auth.verificationFailed}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && t.auth.pleaseWait}
            {status === "success" && message}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <>
              <p className="text-sm text-muted-foreground text-center">
                {t.auth.redirectingToLoginShortly}
              </p>
              <Button asChild className="w-full">
                <Link href="/login">{t.auth.goToLogin}</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <Button asChild className="w-full">
                <Link href="/login">{t.auth.backToLoginPage}</Link>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {t.auth.needResendVerification}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 p-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">{t.auth.loading}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
