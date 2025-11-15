"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
import Link from "next/link";

function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.passwordMismatch || "Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate password strength
    if (
      !passwordStrength.hasLength ||
      !passwordStrength.hasUpperCase ||
      !passwordStrength.hasLowerCase ||
      !passwordStrength.hasNumber
    ) {
      setError(
        t.auth.passwordRequirements ||
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
      );
      return;
    }

    if (!token) {
      setError(
        t.auth.tokenMissing ||
          "Không tìm thấy mã reset. Vui lòng click vào link từ email"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        token,
        password: formData.password,
      });
      setSuccess(response.message);
      setFormData({ password: "", confirmPassword: "" });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Không thể reset mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t.auth.resetPassword || "Reset mật khẩu"}
          </h1>
          <p className="text-gray-600 text-sm">
            {t.auth.resetPasswordDescription ||
              "Nhập mật khẩu mới cho tài khoản của bạn"}
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
              {t.auth.redirectingToLogin ||
                "Đang chuyển hướng đến trang đăng nhập..."}
            </p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.auth.newPassword || "Mật khẩu mới"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder={t.auth.passwordPlaceholder || "••••••••"}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.auth.confirmPassword || "Xác nhận mật khẩu"}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder={t.auth.passwordPlaceholder || "••••••••"}
              />
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {t.auth.passwordRequirementsTitle || "Yêu cầu mật khẩu:"}
                </p>
                <ul className="text-sm space-y-1">
                  <li
                    className={
                      passwordStrength.hasLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasLength ? "✓" : "○"} Ít nhất 8 ký tự
                  </li>
                  <li
                    className={
                      passwordStrength.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasUpperCase ? "✓" : "○"} Có chữ hoa (A-Z)
                  </li>
                  <li
                    className={
                      passwordStrength.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasLowerCase ? "✓" : "○"} Có chữ thường
                    (a-z)
                  </li>
                  <li
                    className={
                      passwordStrength.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {passwordStrength.hasNumber ? "✓" : "○"} Có số (0-9)
                  </li>
                </ul>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? t.auth.resetting || "Đang reset..."
                : t.auth.resetPasswordButton || "Reset mật khẩu"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-3">
          <Link
            href="/login"
            className="text-gray-600 hover:text-gray-800 transition block"
          >
            ← {t.auth.backToLogin || "Quay lại đăng nhập"}
          </Link>
          {!token && (
            <Link
              href="/forgot-password"
              className="text-red-600 font-semibold hover:text-red-700 transition block"
            >
              {t.auth.requestResetLink || "Yêu cầu link reset"} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500">
          <div className="bg-white p-10 rounded-2xl shadow-2xl">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
