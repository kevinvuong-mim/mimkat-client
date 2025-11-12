"use client";

import { withAuth } from "@/components/withAuth";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

/**
 * Example protected page using withAuth HOC
 * This page automatically redirects to /auth if user is not authenticated
 */
function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">
                Full Name
              </label>
              <p className="text-lg text-gray-900">
                {user?.fullName || "Not set"}
              </p>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">
                Username
              </label>
              <p className="text-lg text-gray-900">
                {user?.username || "Not set"}
              </p>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">
                Account Status
              </label>
              <div className="flex gap-4 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user?.isEmailVerified
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user?.isEmailVerified
                    ? "Email Verified"
                    : "Email Not Verified"}
                </span>
              </div>
            </div>

            <div className="border-b pb-4">
              <label className="text-sm font-medium text-gray-500">
                Authentication Methods
              </label>
              <div className="flex gap-4 mt-2">
                {user?.hasPassword && (
                  <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Password
                  </span>
                )}
                {user?.hasGoogleAuth && (
                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    Google
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Link
                href="/auth/change-password"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Password
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export with withAuth HOC - automatically protects this page
export default withAuth(ProfilePage);
