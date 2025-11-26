"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const { mutate } = useMutation({ mutationFn: authService.forgotPassword });

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      { email },
      {
        onSuccess: () => {
          // Clear form
          setEmail("");
        },
        onError: (err) => {
          console.error("Error sending forgot password request: ", err);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          placeholder={t.forgotPassword.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">{t.common.submit}</button>
      </form>
      <Link href="/login">{t.common.backToLogin}</Link>
    </div>
  );
}
