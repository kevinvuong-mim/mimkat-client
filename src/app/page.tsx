"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { t, locale, setLocale } = useI18n();
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <main className="text-center max-w-2xl mx-auto px-4">
        {/* Language Switcher */}
        <div className="flex justify-center mb-6 gap-2">
          <Button
            onClick={() => setLocale("en")}
            variant={locale === "en" ? "default" : "secondary"}
            size="sm"
          >
            English
          </Button>
          <Button
            onClick={() => setLocale("vi")}
            variant={locale === "vi" ? "default" : "secondary"}
            size="sm"
          >
            Tiếng Việt
          </Button>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {t.home.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{t.home.description}</p>

        {/* User Info and Actions */}
        {user ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                {user.avatar && (
                  <Image
                    width={64}
                    height={64}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push("/profile")}
                    src={user.avatar}
                    alt={user.email}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-800">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.isEmailVerified && (
                    <Badge variant="secondary" className="mt-1">
                      ✓ Email đã xác thực
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <Link href="/change-password">Đổi mật khẩu</Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  className="w-full"
                  variant="destructive"
                >
                  Đăng xuất
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button asChild size="lg">
            <Link href="/login">{t.home.authButton}</Link>
          </Button>
        )}
      </main>
    </div>
  );
}
