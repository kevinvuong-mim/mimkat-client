"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
import Link from "next/link";

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
          router.push("/auth");
        }, 3000);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || t.auth.verificationError);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {t.auth.verifyingEmail}
              </h1>
              <p className="text-gray-600">{t.auth.pleaseWait}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {t.auth.verificationSuccess}
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">
                {t.auth.redirectingToLoginShortly}
              </p>
              <Link
                href="/auth"
                className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
              >
                {t.auth.goToLogin}
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {t.auth.verificationFailed}
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/auth"
                  className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                >
                  {t.auth.backToLoginPage}
                </Link>
                <p className="text-sm text-gray-500">
                  {t.auth.needResendVerification}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl">
        <p className="text-gray-600">{t.auth.loading}</p>
      </div>
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
