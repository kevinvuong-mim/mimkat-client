"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const { t } = useI18n();
  const { mutate } = useMutation({
    mutationFn: authService.login,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email: formData.email, password: formData.password },
      {
        onSuccess: () => {
          // After login, redirect to home
          window.location.href = "/";
        },
        onError: (err) => {
          console.error("Login error: ", err);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.email}
          placeholder={t.login.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          value={formData.password}
          placeholder={t.login.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <Link href="/forgot-password">{t.common.forgotPassword}</Link>
        <Link href="/register">{t.common.register}</Link>
        <button type="submit">{t.common.submit}</button>
      </form>

      <GoogleLoginButton />
    </div>
  );
}
