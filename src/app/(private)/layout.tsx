export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-black dark:via-slate-950 dark:to-black p-4">
      {children}
    </div>
  );
}
