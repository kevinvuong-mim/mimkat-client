'use client';

import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Sun, Moon, User, Globe, LogOut, Monitor, Loader2, KeyRound } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/services/auth';
import { useI18n } from '@/context/i18n';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/context/current-user';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { currentUser } = useCurrentUser();
  const { t, locale, setLocale } = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => router.push('/login'),
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="w-full max-w-md">
      <div className="relative space-y-4 rounded-lg border border-slate-300 bg-white p-8 shadow-2xl dark:border-slate-600 dark:bg-slate-800">
        <div className="z-10 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t.home.toggleTheme}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>{t.home.light}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>{t.home.dark}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                {t.home.system}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
              <Image
                fill
                alt=""
                src={'/images/logo.png'}
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{t.home.welcome}</h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">{t.home.language}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8"
                onClick={() => setLocale('en')}
                variant={locale === 'en' ? 'default' : 'outline'}
              >
                {t.home.english}
              </Button>
              <Button
                size="sm"
                className="h-8"
                onClick={() => setLocale('vi')}
                variant={locale === 'vi' ? 'default' : 'outline'}
              >
                {t.home.vietnamese}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={`/${currentUser?.username || currentUser?.id}`}>
                <User className="mr-2 h-4 w-4" />
                {t.home.profile}
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/change-password">
                <KeyRound className="mr-2 h-4 w-4" />
                {t.home.changePassword}
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/sessions">
                <Monitor className="mr-2 h-4 w-4" />
                {t.home.sessions}
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <Button onClick={mutate} className="w-full" disabled={isPending} variant="destructive">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                {t.home.logout}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
