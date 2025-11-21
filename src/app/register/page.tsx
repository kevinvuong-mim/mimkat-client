"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
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
  const [isShowButtonResend, setIsShowButtonResend] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    registerMutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          // Redirect to login page after 3 seconds
          setTimeout(() => router.push("/login"), 3000);
        },
        onError: (err) => {
          setIsShowButtonResend(true);
          console.error("Register error: ", err);
        },
      }
    );
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      console.error("Please enter your email to resend verification");
      return;
    }

    resendVerificationMutate(
      { email: formData.email },
      {
        onSuccess: () => {
          alert("Verification email resent. Please check your inbox.");
        },
        onError: (err) => {
          console.error("Error resending verification email: ", err);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.email}
        placeholder={t.register.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <input
        value={formData.password}
        placeholder={t.register.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <button type="submit">{t.common.submit}</button>

      {isShowButtonResend && (
        <button onClick={handleResendVerification}>
          {t.register.resendVerification}
        </button>
      )}
      <Link href="/login">{t.common.login}</Link>
    </form>
  );
}
