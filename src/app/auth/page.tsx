"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function AuthPage() {
  const { t, isReady } = useI18n();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Đăng nhập với:", {
        email: formData.email,
        password: formData.password,
      });
    } else {
      console.log("Đăng ký với:", formData);
    }

    // Navigate to home page after login/register
    router.push("/");
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      // Send Google token to backend for verification
      const response = await fetch(`${apiUrl}/auth/google/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Redirect to home page
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Google login error:", errorData);
        alert(
          "Đăng nhập Google thất bại: " + (errorData.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Đã xảy ra lỗi trong quá trình đăng nhập");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    alert("Đăng nhập Google thất bại");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fullname: "", email: "", password: "" });
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? t.auth.login : t.auth.register}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.auth.fullname}
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder={t.auth.fullnamePlaceholder}
              />
            </div>
          )}

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t.auth.password}
            </label>
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
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            {isLogin ? t.auth.loginButton : t.auth.registerButton}
          </button>
        </form>

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
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
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
