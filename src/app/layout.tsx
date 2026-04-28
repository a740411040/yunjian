import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const sansCN = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-cn",
  display: "swap"
});

const serifCN = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-serif-cn",
  display: "swap"
});

export const metadata: Metadata = {
  title: "云笺 | 新中式云端笔记",
  description: "一方宣纸，安放灵感。云笺是一款新中式美学云端笔记网站。",
  keywords: ["云笺", "云端笔记", "新中式", "小红书海报", "Next.js", "Supabase"]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${sansCN.variable} ${serifCN.variable}`}>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
