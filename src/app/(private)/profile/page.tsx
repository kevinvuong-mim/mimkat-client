"use client";

import Link from "next/link";
import { Key, Mail, Shield, Monitor, XCircle, CheckCircle } from "lucide-react";

import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-24 h-24 ring-4 ring-slate-200 dark:ring-slate-700">
                <AvatarImage src={user?.avatar || "/images/default-user.png"} />
                <AvatarFallback>
                  {user?.fullName ? user.fullName.charAt(0) : ""}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.fullName || ""}
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.username ? `@${user.username}` : ""}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-4">{t.profile.contact}</h2>

            <InfoRow icon={Mail} value={user?.email} label={t.profile.email} />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold mb-4">
              {t.profile.accountStatus}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <InfoRow
                icon={CheckCircle}
                value={user?.isActive}
                label={t.profile.isActive}
              />
              <InfoRow
                icon={Mail}
                value={user?.isEmailVerified}
                label={t.profile.isEmailVerified}
              />
              <InfoRow
                icon={Key}
                value={user?.hasPassword}
                label={t.profile.hasPassword}
              />
              <InfoRow
                icon={Shield}
                value={user?.hasGoogleAuth}
                label={t.profile.hasGoogleAuth}
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="w-full">
                <Link href="/change-password">
                  <Key className="mr-2 h-4 w-4" />
                  {t.profile.changePassword}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/sessions">
                  <Monitor className="mr-2 h-4 w-4" />
                  {t.home.sessions}
                </Link>
              </Button>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">{t.profile.backToHome}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  icon: any;
  label: string;
  value: string | boolean | undefined;
}) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">
          {typeof value === "boolean" ? (
            <span className="flex items-center gap-1">
              {value ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    {t.profile.yes}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">
                    {t.profile.no}
                  </span>
                </>
              )}
            </span>
          ) : (
            value || "N/A"
          )}
        </p>
      </div>
    </div>
  );
};
