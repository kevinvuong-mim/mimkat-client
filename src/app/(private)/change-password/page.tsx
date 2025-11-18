"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const { user } = useUser();
  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
  });

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
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center">
            {t.auth.changePassword}
          </CardTitle>
          <CardDescription className="text-center">
            {t.auth.changePasswordDescription}
          </CardDescription>

          {/* Info message for Google users without password */}
          {!user?.hasPassword && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t.auth.setPasswordForGoogleUser}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Current Password - Only show if user has existing password */}
            {user?.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  {t.auth.currentPassword}
                </Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required={user?.hasPassword}
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
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.auth.newPassword}</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                placeholder={t.auth.enterNewPassword}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
              />

              {/* Password Strength Indicators */}
              {formData.newPassword && (
                <Card className="bg-muted">
                  <CardContent className="pt-3 pb-3 space-y-1">
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordStrength.hasLength
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {passwordStrength.hasLength ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {t.auth.passwordLengthRequirement}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordStrength.hasUpperCase
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {passwordStrength.hasUpperCase ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {t.auth.passwordUppercaseRequirement}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordStrength.hasLowerCase
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {passwordStrength.hasLowerCase ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {t.auth.passwordLowercaseRequirement}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs ${
                        passwordStrength.hasNumber
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {passwordStrength.hasNumber ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-current" />
                      )}
                      {t.auth.passwordNumberRequirement}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder={t.auth.confirmNewPassword}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full"
            >
              {changePasswordMutation.isPending
                ? t.auth.changing
                : t.auth.changePasswordButton}
            </Button>

            {/* Back to Home Link */}
            <div className="text-center">
              <Button asChild variant="link">
                <Link href="/">{t.auth.backToHome}</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
