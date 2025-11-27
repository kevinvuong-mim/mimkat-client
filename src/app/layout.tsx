import type { Metadata } from "next";

import "./globals.css";
import { I18nProvider } from "@/i18n/context";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Mimkat",
  description: "Mimkat Application",
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
