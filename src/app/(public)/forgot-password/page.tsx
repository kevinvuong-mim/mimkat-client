'use client';

import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
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

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.forgotPassword,
  });

  const formSchema = z.object({
    email: z.string().email(t.forgotPassword.invalidEmail),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      { email: values.email },
      {
        onError: (err) => toast.error(err.message),
        onSuccess: () => {
          form.reset();

          toast.success(t.forgotPassword.emailSentSuccess);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{t.forgotPassword.title}</h1>
          <p className="text-sm text-muted-foreground">{t.forgotPassword.description}</p>
        </div>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.forgotPassword.email}</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder={t.forgotPassword.email} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t.forgotPassword.sending : t.forgotPassword.submit}
            </Button>
          </form>
        </Form>

        <div className="pt-4 border-t">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">{t.forgotPassword.backToLogin}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
