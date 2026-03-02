import type { Metadata } from "next";
import { GeistPixelCircle } from "geist/font/pixel";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "./provider";
import "../index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mint",
  description: "A minimalist expense tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelCircle.variable}`}
    >
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
