import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppDirection from "@/components/common/AppDirection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StatsApp DGB",
  description: "SSR Next.js UI with mock data",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <AppDirection />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
