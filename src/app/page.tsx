"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { t, locale, setLocale, isReady } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="text-center max-w-2xl mx-auto px-4">
        {/* Language Switcher */}
        <div className="flex justify-center mb-6 gap-2">
          <button
            onClick={() => setLocale("en")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              locale === "en"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLocale("vi")}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              locale === "vi"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tiếng Việt
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {t.home.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{t.home.description}</p>

        {/* User Info and Actions */}
        {isAuthenticated && user ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.email}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-800">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
                {user.emailVerified && (
                  <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    ✓ Email đã xác thực
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            {t.home.authButton}
          </Link>
        )}
      </main>
    </div>
  );
}
