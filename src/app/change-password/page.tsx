"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        setFormData({ currentPassword: "", newPassword: "" });

        // Redirect to login page after 3 seconds
        setTimeout(() => router.push("/login"), 3000);
      },
      onError: (err) => {
        console.error("Error changing password: ", err);
      },
    });
  };

  return (
    <div>
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
        <button type="submit">{t.common.submit}</button>
      </form>
      <Link href="/">{t.common.backToHome}</Link>
    </div>
  );
}
