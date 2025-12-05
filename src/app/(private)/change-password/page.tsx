'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
import { usersService } from '@/services/users.service';
import { useCurrentUser } from '@/context/current-user-context';

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { currentUser } = useCurrentUser();

  const { mutate, isPending } = useMutation({
    mutationFn: usersService.changePassword,
  });

  const formSchema = z
    .object({
      newPassword: z
        .string()
        .min(8, t.changePassword.newPasswordMinLength)
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t.changePassword.newPasswordPattern,
        ),
      confirmPassword: z
        .string()
        .min(1, t.changePassword.confirmPasswordRequired),
      currentPassword: currentUser?.hasPassword
        ? z.string().min(1, t.changePassword.currentPasswordRequired)
        : z.string().optional(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t.changePassword.passwordsDoNotMatch,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      currentPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
    current: false,
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const changeData = currentUser?.hasPassword
      ? {
          newPassword: values.newPassword,
          currentPassword: values.currentPassword,
        }
      : {
          newPassword: values.newPassword,
        };

    mutate(changeData, {
      onError: (err) => toast.error(err.message),
      onSuccess: () => {
        form.reset();

        setTimeout(() => router.push('/login'), 3000);

        toast.success(t.changePassword.passwordChangedSuccessfully);
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {
              t.changePassword[
                currentUser?.hasPassword
                  ? 'titleHasPassword'
                  : 'titleNoPassword'
              ]
            }
          </h1>
          <p className="text-sm text-muted-foreground">
            {
              t.changePassword[
                currentUser?.hasPassword
                  ? 'descriptionHasPassword'
                  : 'descriptionNoPassword'
              ]
            }
          </p>
        </div>

        <Form {...form}>
          <form className="space-y-1" onSubmit={form.handleSubmit(onSubmit)}>
            {currentUser?.hasPassword && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.changePassword.currentPassword}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder={t.changePassword.currentPassword}
                          type={showPassword.current ? 'text' : 'password'}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword.current ? (
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
            )}
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.changePassword.newPassword}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={t.changePassword.newPassword}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  <FormLabel>{t.changePassword.confirmPassword}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder={t.changePassword.confirmPassword}
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.changePassword[
                  currentUser?.hasPassword
                    ? 'submitHasPassword'
                    : 'submitNoPassword'
                ]
              )}
            </Button>
          </form>
        </Form>

        <div className="pt-4 border-t">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">{t.changePassword.backToHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
