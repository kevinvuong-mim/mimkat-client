"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { useI18n } from "@/i18n/context";

export default function ProfilePage() {
  const { t } = useI18n();
  const { user } = useUser();

  return (
    <div>
      <p>
        {t.profile.avatar}:{" "}
        <Image
          alt=""
          width={100}
          height={100}
          src={user?.avatar || "/images/default-avatar.png"}
        />
      </p>
      <p>
        {t.profile.email}: {user?.email}
      </p>
      <p>
        {t.profile.fullName}: {user?.fullName}
      </p>
      <p>
        {t.profile.username}: {user?.username}
      </p>
      <p>
        {t.profile.isActive}: {user?.isActive}
      </p>
      <p>
        {t.profile.isEmailVerified}: {user?.isEmailVerified}
      </p>
      <p>
        {t.profile.hasPassword}: {user?.hasPassword}
      </p>
      <p>
        {t.profile.hasGoogleAuth}: {user?.hasGoogleAuth}
      </p>
      <Link href="/">{t.common.backToHome}</Link>
      <Link href="/change-password">{t.common.changePassword}</Link>
    </div>
  );
}
