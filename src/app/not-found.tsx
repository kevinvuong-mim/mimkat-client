'use client';

import Link from 'next/link';

import { useI18n } from '@/i18n/context';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      <div className="bg-white border border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl">
        <p className="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">
          404
        </p>
        <p className="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4 text-center">
          {t.notFound.title}
        </p>
        <p className="text-gray-500 mt-4 pb-4 text-center">{t.notFound.description}</p>
        <div className="pt-4 border-t w-full text-center">
          <Button asChild variant="outline">
            <Link href="/">{t.notFound.backToHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
