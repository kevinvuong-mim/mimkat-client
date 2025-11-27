"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { User, Globe, LogOut, Monitor, KeyRound } from "lucide-react";

import { useI18n } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export default function Home() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const { mutate } = useMutation({ mutationFn: authService.logout });

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => router.push("/login"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                alt=""
                width={120}
                height={120}
                className="rounded-lg"
                src={"/images/logo.png"}
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t.home.welcome}
            </h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium flex-1">
                {t.home.language}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => setLocale("en")}
                  variant={locale === "en" ? "default" : "outline"}
                >
                  {t.home.english}
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={() => setLocale("vi")}
                  variant={locale === "vi" ? "default" : "outline"}
                >
                  {t.home.vietnamese}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  {t.home.profile}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/change-password">
                  <KeyRound className="mr-2 h-4 w-4" />
                  {t.home.changePassword}
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href="/sessions">
                  <Monitor className="mr-2 h-4 w-4" />
                  {t.home.sessions}
                </Link>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              className="w-full"
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t.home.logout}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
