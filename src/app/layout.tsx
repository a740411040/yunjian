import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { PwaSupport } from "@/components/pwa/PwaSupport";
import { ThemeDock } from "@/components/theme/ThemeDock";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "云笺 | 新中式云端笔记与社区",
  description: "一方宣纸，安放灵感。云笺是可安装的新中式云端笔记与社区应用。",
  keywords: ["云笺", "云端笔记", "新中式", "PWA", "Next.js", "Supabase"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "云笺"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/pwa/icon-192", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      {
        url: "/pwa/apple-touch-icon",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#10151d" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      data-theme-mode="day"
    >
      <body>
        <ThemeProvider>
          {children}
          <PwaSupport />
          <ThemeDock />
        </ThemeProvider>
        <Toaster richColors closeButton position="top-center" />
      </body>
    </html>
  );
}
