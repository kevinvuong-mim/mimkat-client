"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { authService } from "@/services/auth.service";
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
import { ArrowLeft, CheckCircle2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center">
            {t.auth.resetPassword || "Reset mật khẩu"}
          </CardTitle>
          <CardDescription className="text-center">
            {t.auth.resetPasswordDescription ||
              "Nhập mật khẩu mới cho tài khoản của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert>
              <AlertDescription>
                <p className="font-medium">{success}</p>
                <p className="text-sm mt-2">
                  {t.auth.redirectingToLogin ||
                    "Đang chuyển hướng đến trang đăng nhập..."}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t.auth.newPassword || "Mật khẩu mới"}
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder={t.auth.passwordPlaceholder || "••••••••"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t.auth.confirmPassword || "Xác nhận mật khẩu"}
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder={t.auth.passwordPlaceholder || "••••••••"}
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <Card className="bg-muted">
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm font-medium">
                      {t.auth.passwordRequirementsTitle || "Yêu cầu mật khẩu:"}
                    </p>
                    <ul className="text-sm space-y-1">
                      <li
                        className={
                          passwordStrength.hasLength
                            ? "text-green-600 flex items-center gap-2"
                            : "text-muted-foreground flex items-center gap-2"
                        }
                      >
                        {passwordStrength.hasLength ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-current" />
                        )}
                        Ít nhất 8 ký tự
                      </li>
                      <li
                        className={
                          passwordStrength.hasUpperCase
                            ? "text-green-600 flex items-center gap-2"
                            : "text-muted-foreground flex items-center gap-2"
                        }
                      >
                        {passwordStrength.hasUpperCase ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-current" />
                        )}
                        Có chữ hoa (A-Z)
                      </li>
                      <li
                        className={
                          passwordStrength.hasLowerCase
                            ? "text-green-600 flex items-center gap-2"
                            : "text-muted-foreground flex items-center gap-2"
                        }
                      >
                        {passwordStrength.hasLowerCase ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-current" />
                        )}
                        Có chữ thường (a-z)
                      </li>
                      <li
                        className={
                          passwordStrength.hasNumber
                            ? "text-green-600 flex items-center gap-2"
                            : "text-muted-foreground flex items-center gap-2"
                        }
                      >
                        {passwordStrength.hasNumber ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-current" />
                        )}
                        Có số (0-9)
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? t.auth.resetting || "Đang reset..."
                  : t.auth.resetPasswordButton || "Reset mật khẩu"}
              </Button>
            </form>
          )}

          <div className="space-y-2 text-center">
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.auth.backToLogin || "Quay lại đăng nhập"}
              </Link>
            </Button>
            {!token && (
              <Button asChild variant="link" className="w-full">
                <Link href="/forgot-password">
                  {t.auth.requestResetLink || "Yêu cầu link reset"}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500 p-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
