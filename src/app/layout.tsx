import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/i18n/context";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Mimkat Client",
  description: "Mimkat Client Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <I18nProvider>{children}</I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
