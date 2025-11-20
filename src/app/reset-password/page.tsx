"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = searchParams.get("token");

    if (!token) {
      console.error("No token provided");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Validate password strength
    if (
      !passwordStrength.hasLength ||
      !passwordStrength.hasUpperCase ||
      !passwordStrength.hasLowerCase ||
      !passwordStrength.hasNumber
    ) {
      console.error("Password does not meet strength requirements");
      return;
    }

    mutate(
      {
        token,
        password: formData.password,
      },
      {
        onSuccess: () => {
          // Clear form
          setFormData({ password: "", confirmPassword: "" });

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
    <form onSubmit={handleSubmit}>
      <input
        value={formData.password}
        placeholder={t.resetPassword.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        value={formData.confirmPassword}
        placeholder={t.resetPassword.confirmPassword}
        onChange={(e) =>
          setFormData({
            ...formData,
            confirmPassword: e.target.value,
          })
        }
      />
      <button type="submit">{t.common.submit}</button>
      <Link href="/login">{t.common.login}</Link>
    </form>
  );
}
