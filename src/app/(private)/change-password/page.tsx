"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { useChangePassword } from "@/hooks/useUser";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const { user } = useUser();
  const changePasswordMutation = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    const password = formData.newPassword;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  }, [formData.newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t.auth.passwordsDoNotMatch);
      return;
    }

    // Validate password strength
    if (
      !passwordStrength.hasLength ||
      !passwordStrength.hasUpperCase ||
      !passwordStrength.hasLowerCase ||
      !passwordStrength.hasNumber
    ) {
      setError(t.auth.passwordRequirements);
      return;
    }

    const changeData = user?.hasPassword
      ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      : {
          newPassword: formData.newPassword,
        };

    changePasswordMutation.mutate(changeData, {
      onSuccess: (response) => {
        setError("");
        setSuccess(response.message);

        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Wait 3 seconds to show success message, then clear tokens and redirect
        setTimeout(() => {
          // Force reload to clear all React state and redirect to login
          window.location.href = "/login";
        }, 3000);
      },
      onError: (err) => {
        setSuccess("");
        setError(
          err instanceof Error ? err.message : t.auth.changePasswordError
        );
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {t.auth.changePassword}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t.auth.changePasswordDescription}
          </p>

          {/* Info message for Google users without password */}
          {!user?.hasPassword && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4 border border-blue-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    {t.auth.setPasswordForGoogleUser}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Current Password - Only show if user has existing password */}
            {user?.hasPassword && (
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t.auth.currentPassword}
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required={user?.hasPassword}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder={t.auth.enterCurrentPassword}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.auth.newPassword}
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={t.auth.enterNewPassword}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />

              {/* Password Strength Indicators */}
              {formData.newPassword && (
                <div className="mt-2 space-y-1 text-xs">
                  <div
                    className={`flex items-center ${
                      passwordStrength.hasLength
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="mr-2">
                      {passwordStrength.hasLength ? "✓" : "○"}
                    </span>
                    {t.auth.passwordLengthRequirement}
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordStrength.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="mr-2">
                      {passwordStrength.hasUpperCase ? "✓" : "○"}
                    </span>
                    {t.auth.passwordUppercaseRequirement}
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordStrength.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="mr-2">
                      {passwordStrength.hasLowerCase ? "✓" : "○"}
                    </span>
                    {t.auth.passwordLowercaseRequirement}
                  </div>
                  <div
                    className={`flex items-center ${
                      passwordStrength.hasNumber
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="mr-2">
                      {passwordStrength.hasNumber ? "✓" : "○"}
                    </span>
                    {t.auth.passwordNumberRequirement}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t.auth.confirmPassword}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={t.auth.confirmNewPassword}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {changePasswordMutation.isPending ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t.auth.changing}
                </span>
              ) : (
                t.auth.changePasswordButton
              )}
            </button>
          </div>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {t.auth.backToHome}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
