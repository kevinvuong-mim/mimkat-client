'use client';

import {
  Sun,
  Moon,
  User,
  Globe,
  LogOut,
  Monitor,
  Loader2,
  KeyRound,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/user-context';
import { authService } from '@/services/auth.service';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const { setTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();

  const { mutate, isPending } = useMutation({ mutationFn: authService.logout });

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => router.push('/login'),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-300 dark:border-slate-600 p-8 space-y-4 relative">
        <div className="flex z-10 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">{t.home.toggleTheme}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                {t.home.light}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                {t.home.dark}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                {t.home.system}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
              <Image
                fill
                alt=""
                src={'/images/logo.png'}
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t.home.welcome}
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium flex-1">
              {t.home.language}
            </span>
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
              <Link href={`/${user?.username || user?.id}`}>
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

        <div className="pt-4 border-t">
          <Button
            className="w-full"
            disabled={isPending}
            variant="destructive"
            onClick={handleLogout}
          >
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
