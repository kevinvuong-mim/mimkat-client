"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/context";
import { useUser } from "@/context/UserContext";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const { user } = useUser();
  const router = useRouter();
  const { mutate } = useMutation({ mutationFn: userService.changePassword });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    const password = formData.newPassword;
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  }, [formData.newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
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

    const changeData = user?.hasPassword
      ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      : {
          newPassword: formData.newPassword,
        };

    mutate(changeData, {
      onSuccess: () => {
        // Redirect to login page after 3 seconds
        setTimeout(() => router.push("/login"), 3000);
      },
      onError: (err) => {
        console.error("Error changing password: ", err);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.currentPassword}
        placeholder={t.changePassword.currentPassword}
        onChange={(e) =>
          setFormData({ ...formData, currentPassword: e.target.value })
        }
      />
      <input
        value={formData.newPassword}
        placeholder={t.changePassword.newPassword}
        onChange={(e) =>
          setFormData({ ...formData, newPassword: e.target.value })
        }
      />
      <input
        value={formData.confirmPassword}
        placeholder={t.changePassword.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
      />
      <button type="submit">{t.common.submit}</button>
      <Link href="/">{t.common.backToHome}</Link>
    </form>
  );
}
