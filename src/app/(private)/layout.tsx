import { CurrentUserProvider } from '@/context/current-user';

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CurrentUserProvider>{children}</CurrentUserProvider>
    </div>
  );
}
