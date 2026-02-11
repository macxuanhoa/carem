import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import Providers from "./providers";
import AppShell from "@/components/AppShell";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  adjustFontFallback: true,
  preload: true,
});

export const metadata: Metadata = {
  title: "Quản Lý Xe",
  description: "Hệ thống quản lý xe chuyên nghiệp",
  manifest: "/manifest.json",
  icons: {
    icon: '/avtcarem.jpg',
    apple: '/avtcarem.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Webxe2",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#090513", // Galaxy Deep Black
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="dark">
      <body className={`${inter.className} min-h-screen pb-20 md:pb-0 bg-background text-foreground`}>
        <Providers>
        <NextTopLoader 
          color="#a855f7" // Purple-500
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #a855f7,0 0 5px #a855f7"
        />
        <AppShell>
            {children}
            <ScrollToTop />
            <Toaster 
              position="top-right" 
              theme="dark"
              richColors 
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4',
                  title: 'text-white font-bold text-sm',
                  description: 'text-slate-400 text-xs font-medium',
                  actionButton: 'bg-violet-600 text-white font-bold rounded-xl text-xs',
                  cancelButton: 'bg-slate-800 text-slate-300 font-bold rounded-xl text-xs',
                },
                style: {
                  borderRadius: '16px',
                  padding: '16px',
                }
              }}
            />
        </AppShell>
        </Providers>
      </body>
    </html>
  );
}
