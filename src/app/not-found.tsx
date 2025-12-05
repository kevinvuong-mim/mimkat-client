'use client';

import Link from 'next/link';

import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 p-4 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-8 shadow-2xl md:px-8 lg:px-24">
        <p className="text-6xl font-bold tracking-wider text-gray-300 md:text-7xl lg:text-9xl">
          404
        </p>
        <p className="mt-4 text-center text-2xl font-bold tracking-wider text-gray-500 md:text-3xl lg:text-5xl">
          {t.notFound.title}
        </p>
        <p className="mt-4 pb-4 text-center text-gray-500">{t.notFound.description}</p>
        <div className="w-full border-t pt-4 text-center">
          <Button asChild variant="outline">
            <Link href="/">{t.notFound.backToHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
