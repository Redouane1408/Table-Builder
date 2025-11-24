import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppDirection from "@/components/common/AppDirection";


export const metadata: Metadata = {
  title: "StatsApp DGB",
  description: "SSR Next.js UI with mock data",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`antialiased`}>
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
