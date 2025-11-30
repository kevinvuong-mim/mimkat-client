export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 dark:from-blue-900 dark:via-blue-800 dark:to-blue-950 p-4">
      {children}
    </div>
  );
}
