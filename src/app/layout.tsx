import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SesjaMaster - Twoja platforma do nauki",
  description: "Ucz się efektywnie z quizami, fiszkami i materiałami audio. Przygotuj się do sesji egzaminacyjnej!",
  keywords: ["nauka", "quizy", "fiszki", "egzaminy", "edukacja", "studia", "sesja"],
  authors: [{ name: "SesjaMaster" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
  openGraph: {
    title: "SesjaMaster",
    description: "Ucz się efektywnie z quizami, fiszkami i materiałami audio",
    siteName: "SesjaMaster",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SesjaMaster",
    description: "Ucz się efektywnie z quizami, fiszkami i materiałami audio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
