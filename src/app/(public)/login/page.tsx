'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

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
import GoogleLoginButton from '@/components/google-login-button';

export default function LoginPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
  });

  const formSchema = z.object({
    email: z.string().email(t.login.invalidEmail),
    password: z.string().min(1, t.login.passwordRequired),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onError: (err) => toast.error(err.message),
      onSuccess: () => {
        form.reset();
        window.location.href = searchParams.get('redirect') || '/';
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6 rounded-lg border border-slate-300 bg-white p-8 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{t.login.title}</h1>
          <p className="text-sm text-muted-foreground">{t.login.description}</p>
        </div>

        <Form {...form}>
          <form className="space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.login.email}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder={t.login.email} />
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
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.login.password}</FormLabel>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      {t.login.forgotPassword}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={t.login.password}
                        type={showPassword ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t.login.submit}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground dark:bg-slate-800">
              {t.login.orContinueWith}
            </span>
          </div>
        </div>

        <GoogleLoginButton />

        <div className="border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t.login.noAccount}{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              {t.login.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
