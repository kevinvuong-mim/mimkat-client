"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";

export default function Home() {
  const { t, locale, setLocale, isReady } = useI18n();

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="text-center">
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

        <Link
          href="/auth"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          {t.home.authButton}
        </Link>
      </main>
    </div>
  );
}
