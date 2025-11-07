"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const handleCallback = () => {
      const userDataEncoded = searchParams.get("userData");
      const success = searchParams.get("success");
      const error = searchParams.get("error");

      if (error) {
        console.error("Authentication error:", error);
        setStatus("error");
        setTimeout(() => router.push("/auth"), 2000);
        return;
      }

      // For web clients, tokens are in httpOnly cookies
      // We only receive user data
      if (success && userDataEncoded) {
        try {
          const userDataString = atob(userDataEncoded);
          const userData = JSON.parse(userDataString);

          // Set user in context (tokens already in cookies)
          setUser(userData);
          setStatus("success");

          // Redirect to home
          setTimeout(() => router.push("/"), 1000);
        } catch (err) {
          console.error("Error parsing user data:", err);
          setStatus("error");
          setTimeout(() => router.push("/auth"), 2000);
        }
      } else {
        setStatus("error");
        setTimeout(() => router.push("/auth"), 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đang xác thực...
              </h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đăng nhập thành công!
              </h2>
              <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Đăng nhập thất bại
              </h2>
              <p className="text-sm text-gray-500">
                Đang quay lại trang đăng nhập...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
          <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Đang tải...
              </h2>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
