"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth.service";
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

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useUser();

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
      await authService.register({
        email: formData.email,
        password: formData.password,
      });
      setSuccess(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );
      setFormData({ email: "", password: "" });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">
            {t.auth.register}
          </CardTitle>
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
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t.auth.emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder={t.auth.passwordPlaceholder}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : t.auth.registerButton}
            </Button>
          </form>

          {/* Resend Verification Email Button */}
          {(success || error.toLowerCase().includes("verify")) && (
            <Button
              onClick={handleResendVerification}
              disabled={isLoading}
              variant="secondary"
              className="w-full"
            >
              Gửi lại email xác thực
            </Button>
          )}

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t.auth.haveAccount} </span>
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              {t.auth.loginNow}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
