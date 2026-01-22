import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import RecaptchaProvider from "@/components/RecaptchaProvider";

export const metadata: Metadata = {
  title: "Matemáticas de Fedor",
  description: "Plataforma Educativa de Matemáticas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white dark:bg-[#1C1D1F] text-black dark:text-white transition-colors">
        <ThemeProvider>
          <RecaptchaProvider>
            <Navbar />
            <main>{children}</main>
          </RecaptchaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
