"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProtectedData, logout, isAuthenticated } from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
}

/**
 * Example component showing how to use authentication utilities
 * This is a reference implementation - customize as needed
 */
export default function ProfileExample() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push("/auth");
      return;
    }

    // Fetch user profile
    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchProtectedData("/api/user/profile");
      const data = await response.json();

      setProfile(data.user);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Will redirect to /auth automatically
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold mb-2">Có lỗi xảy ra</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Đăng xuất
            </button>
          </div>

          {profile && (
            <div className="flex items-center gap-6">
              {profile.avatar && (
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {profile.fullName}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-gray-500 text-sm mt-1">ID: {profile.id}</p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thông tin session
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Access Token:</span>
                <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  {localStorage.getItem("accessToken")?.substring(0, 50)}...
                </code>
              </div>
              <div>
                <span className="text-gray-600">Authenticated:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  ✓ Đã đăng nhập
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">
            📝 Note: Example Component
          </h3>
          <p className="text-blue-700 text-sm">
            Đây là component mẫu để demo cách sử dụng authentication utilities.
            File này không được sử dụng trong app, chỉ để tham khảo.
          </p>
          <p className="text-blue-700 text-sm mt-2">
            Location:{" "}
            <code className="bg-blue-100 px-1 rounded">
              src/components/ProfileExample.tsx
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
