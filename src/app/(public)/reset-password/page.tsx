'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useI18n } from '@/i18n/context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: authService.resetPassword,
  });

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, t.resetPassword.passwordMinLength)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t.resetPassword.passwordPattern),
      confirmPassword: z.string().min(1, t.resetPassword.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t.resetPassword.passwordsDoNotMatch,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error(t.resetPassword.noToken);
      return;
    }

    mutate(
      {
        token,
        password: values.password,
      },
      {
        onError: (err) => toast.error(err.message),
        onSuccess: () => {
          form.reset();

          setTimeout(() => router.push('/login'), 3000);

          toast.success(t.resetPassword.passwordResetSuccess);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-8 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t.resetPassword.title}</h1>
          <p className="text-sm text-muted-foreground">{t.resetPassword.description}</p>
        </div>

        <Form {...form}>
          <form className="space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.resetPassword.password}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={t.resetPassword.password}
                        type={showPassword.new ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword.new ? (
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
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.resetPassword.confirmPassword}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={t.resetPassword.confirmPassword}
                        type={showPassword.confirm ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword.confirm ? (
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t.resetPassword.submit}
            </Button>
          </form>
        </Form>

        <div className="border-t pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">{t.resetPassword.login}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
