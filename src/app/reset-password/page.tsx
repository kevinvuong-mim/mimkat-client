"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate } = useMutation({ mutationFn: authService.resetPassword });

  const [formData, setFormData] = useState({
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token provided");
      return;
    }

    mutate(
      {
        token,
        password: formData.password,
      },
      {
        onSuccess: () => {
          setFormData({ password: "" });

          // Redirect to login after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        },
        onError: (err) => {
          console.error("Error resetting password: ", err);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.password}
          placeholder={t.resetPassword.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">{t.common.submit}</button>
      </form>
      <Link href="/login">{t.common.login}</Link>
    </div>
  );
}
