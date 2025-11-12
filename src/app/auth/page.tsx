"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth.service";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function AuthPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useUser();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        const authData = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        // After login, fetch user profile
        // We don't get user data from login response anymore, need to fetch it
        window.location.href = "/";
      } else {
        // Register
        await authService.register({
          email: formData.email,
          password: formData.password,
        });
        setSuccess(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        );
        setFormData({ email: "", password: "" });
        // Switch to login mode after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setSuccess("");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError("Vui lòng nhập email để gửi lại email xác thực");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.resendVerification({ email: formData.email });
      setSuccess("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư.");
    } catch (err: any) {
      setError(err.message || "Không thể gửi lại email xác thực");
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "" });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? t.auth.login : t.auth.register}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t.auth.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              placeholder={t.auth.emailPlaceholder}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t.auth.password}
              </label>
              {isLogin && (
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-700 transition"
                >
                  {t.auth.forgotPasswordLink || "Quên mật khẩu?"}
                </a>
              )}
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              placeholder={t.auth.passwordPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Đang xử lý..."
              : isLogin
              ? t.auth.loginButton
              : t.auth.registerButton}
          </button>
        </form>

        {/* Resend Verification Email Button (only show in login mode if there's an error about unverified email) */}
        {isLogin && error.toLowerCase().includes("verify") && (
          <div className="mt-4">
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi lại email xác thực
            </button>
          </div>
        )}

        {isLogin && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {t.common.or}
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLoginButton />
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? t.auth.noAccount : t.auth.haveAccount}{" "}
            <button
              onClick={toggleMode}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
            >
              {isLogin ? t.auth.registerNow : t.auth.loginNow}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
