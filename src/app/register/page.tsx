"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const { t } = useI18n();
  const { mutate: registerMutate } = useMutation({
    mutationFn: authService.register,
  });
  const { mutate: resendVerificationMutate } = useMutation({
    mutationFn: authService.resendVerification,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isShowResendButton, setIsShowResendButton] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    registerMutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          setFormData({ ...formData, password: "" });

          // Show resend button after 3 seconds
          setTimeout(() => setIsShowResendButton(true), 3000);
        },
        onError: (err) => {
          console.error("Register error: ", err);
        },
      }
    );
  };

  const handleResendVerification = async () => {
    resendVerificationMutate(
      { email: formData.email },
      {
        onSuccess: () => {
          setFormData({ email: "", password: "" });
        },
        onError: (err) => {
          console.error("Error resending verification email: ", err);
        },
      }
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.email}
          placeholder={t.register.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          value={formData.password}
          placeholder={t.register.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit">{t.common.submit}</button>
      </form>
      {isShowResendButton && (
        <button onClick={handleResendVerification}>
          {t.register.resendVerification}
        </button>
      )}
      <Link href="/login">{t.common.login}</Link>
    </div>
  );
}
