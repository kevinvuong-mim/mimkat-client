"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      setSuccess(response.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Không thể gửi email reset mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t.auth.forgotPassword || "Quên mật khẩu"}
          </h1>
          <p className="text-gray-600 text-sm">
            {t.auth.forgotPasswordDescription ||
              "Nhập email của bạn và chúng tôi sẽ gửi link reset mật khẩu"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">{success}</p>
            <p className="text-sm mt-2">
              {t.auth.checkEmailInbox ||
                "Vui lòng kiểm tra email của bạn và click vào link để reset mật khẩu"}
            </p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.auth.email || "Email"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder={t.auth.emailPlaceholder || "your@email.com"}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? t.auth.sending || "Đang gửi..."
                : t.auth.sendResetLink || "Gửi link reset mật khẩu"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-3">
          <Link
            href="/auth"
            className="text-gray-600 hover:text-gray-800 transition block"
          >
            ← {t.auth.backToLogin || "Quay lại đăng nhập"}
          </Link>
          {success && (
            <Link
              href="/reset-password"
              className="text-red-600 font-semibold hover:text-red-700 transition block"
            >
              {t.auth.alreadyHaveToken || "Đã có mã reset?"} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
