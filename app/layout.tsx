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
  title: {
    template: '%s | Carem92',
    default: 'Hệ Thống Quản Lý Xe Carem92',
  },
  description: "Giải pháp quản lý kinh doanh xe toàn diện, tối ưu lợi nhuận và dòng tiền.",
  manifest: "/manifest.json",
  icons: {
    icon: '/avtcarem.jpg',
    apple: '/avtcarem.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Carem92",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Carem92 - Quản Lý Xe Chuyên Nghiệp',
    description: 'Theo dõi tồn kho, doanh thu và lợi nhuận xe realtime.',
    siteName: 'Carem92',
    locale: 'vi_VN',
    type: 'website',
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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen pb-20 md:pb-0 bg-background text-foreground antialiased`}>
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
          template='<div class="bar" role="bar"><div class="peg"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <AppShell>
            {children}
            <ScrollToTop />
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              toastOptions={{
                classNames: {
                  toast: 'bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl p-4',
                  title: 'text-slate-900 dark:text-white font-bold text-sm',
                  description: 'text-slate-500 dark:text-slate-400 text-xs font-medium',
                  actionButton: 'bg-violet-600 text-white font-bold rounded-xl text-xs',
                  cancelButton: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold rounded-xl text-xs',
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
