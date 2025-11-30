import type { Metadata } from "next";

import "./globals.css";
import { I18nProvider } from "@/i18n/context";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/user-context";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Mimkat",
  description: "Mimkat Application",
  icons: { icon: "/images/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <UserProvider>
            <I18nProvider>{children}</I18nProvider>
          </UserProvider>
        </QueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
