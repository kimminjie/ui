import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { K_LEAGUE_NOTICE, PROMPT_PLACEHOLDER } from "./constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "한국 축구 K리그 질문 전용 챗봇",
  description: `${K_LEAGUE_NOTICE} ${PROMPT_PLACEHOLDER}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
