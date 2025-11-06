"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuthData } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      // Get the current URL with all query parameters
      const fullUrl = window.location.href;

      try {
        // Call the API callback endpoint with the full URL
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(
          `${API_URL}/api/v1/auth/google/callback${window.location.search}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Google authentication failed");
        }

        const data = await response.json();

        // Save authentication data
        setAuthData(data);

        setStatus("success");
        setMessage("Đăng nhập Google thành công!");

        // Redirect to home page
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Đăng nhập Google thất bại");

        // Redirect to auth page after 3 seconds
        setTimeout(() => {
          router.push("/auth");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuthData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Đang xác thực với Google...
              </h1>
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
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {message}
              </h1>
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
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {message}
              </h1>
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
