export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-4 dark:from-blue-900 dark:via-blue-800 dark:to-blue-950">
      {children}
    </div>
  );
}
