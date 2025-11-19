"use client";

import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ email });
      setSuccess(response.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Không thể gửi email reset mật khẩu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 via-pink-400 to-purple-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center">
            {t.auth.forgotPassword || "Quên mật khẩu"}
          </CardTitle>
          <CardDescription className="text-center">
            {t.auth.forgotPasswordDescription ||
              "Nhập email của bạn và chúng tôi sẽ gửi link reset mật khẩu"}
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
                  {t.auth.checkEmailInbox ||
                    "Vui lòng kiểm tra email của bạn và click vào link để reset mật khẩu"}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email || "Email"}</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t.auth.emailPlaceholder || "your@email.com"}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? t.auth.sending || "Đang gửi..."
                  : t.auth.sendResetLink || "Gửi link reset mật khẩu"}
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
            {success && (
              <Button asChild variant="link" className="w-full">
                <Link href="/reset-password">
                  {t.auth.alreadyHaveToken || "Đã có mã reset?"}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
