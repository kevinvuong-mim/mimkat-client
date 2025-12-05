import type { Metadata } from 'next';

import './globals.css';
import { I18nProvider } from '@/i18n/context';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { CurrentUserProvider } from '@/context/current-user-context';

export const metadata: Metadata = {
  title: 'Mimkat',
  description: 'Mimkat Application',
  icons: { icon: '/images/logo.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <QueryProvider>
            <CurrentUserProvider>
              <I18nProvider>{children}</I18nProvider>
            </CurrentUserProvider>
          </QueryProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
