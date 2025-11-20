"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/i18n/context";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function Home() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const { mutate } = useMutation({ mutationFn: authService.logout });

  const handleLogout = async () => {
    mutate(undefined, {
      onSuccess: () => router.push("/login"),
      onError: (err) => {
        console.error("Logout error:", err);
      },
    });
  };

  return (
    <div>
      <Image alt="" width={100} height={100} src={"/images/logo.png"} />
      <button
        onClick={() => setLocale("en")}
        style={{ fontWeight: locale === "en" ? "bold" : "normal" }}
      >
        {t.home.english}
      </button>
      <button
        onClick={() => setLocale("vi")}
        style={{ fontWeight: locale === "vi" ? "bold" : "normal" }}
      >
        {t.home.vietnamese}
      </button>
      <button onClick={handleLogout}>{t.home.logout}</button>
      <Link href="/profile">{t.common.profile}</Link>
      <Link href="/change-password">{t.common.changePassword}</Link>
    </div>
  );
}
