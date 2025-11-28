"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useI18n } from "@/i18n/context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const { t } = useI18n();
  const {
    mutate: resendVerificationMutate,
    isPending: isResendVerificationPending,
  } = useMutation({
    mutationFn: authService.resendVerification,
  });
  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    mutationFn: authService.register,
  });

  const formSchema = z.object({
    email: z
      .string()
      .min(1, t.register.emailRequired)
      .email(t.register.emailInvalid),
    password: z.string().min(8, t.register.passwordMinLength),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const formatTime = (seconds: number) => {
    const secs = seconds % 60;
    const mins = Math.floor(seconds / 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    registerMutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          form.reset();

          setCountdown(300);
          setRegisteredEmail(values.email);

          toast.success(t.register.successMessage);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleResendVerification = async () => {
    resendVerificationMutate(
      { email: registeredEmail },
      {
        onSuccess: () => {
          setCountdown(300);

          toast.success(t.register.resendSuccess);
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {t.register.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.register.description}
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.email}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder={t.register.email}
                        />
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.register.password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder={t.register.password}
                          type={showPassword ? "text" : "password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isRegisterPending}
              >
                {isRegisterPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t.register.submit
                )}
              </Button>
            </form>
          </Form>

          {Boolean(registeredEmail) && (
            <div className="space-y-2">
              <p className="text-sm text-center text-muted-foreground">
                {t.register.didNotReceiveEmail}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={countdown > 0 || isResendVerificationPending}
              >
                {isResendVerificationPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : countdown > 0 ? (
                  `${t.register.resendVerification} (${formatTime(countdown)})`
                ) : (
                  t.register.resendVerification
                )}
              </Button>
            </div>
          )}

          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              {t.register.alreadyHaveAccount}{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                {t.register.login}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
