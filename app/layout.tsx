import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import Providers from "./providers";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quản Lý Xe",
  description: "Hệ thống quản lý xe chuyên nghiệp",
  manifest: "/manifest.json",
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
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen pb-20 md:pb-0 selection:bg-blue-100 selection:text-blue-900`}>
        <Providers>
        <NextTopLoader 
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
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
                  toast: 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl p-4',
                  title: 'text-gray-800 dark:text-white font-bold text-sm',
                  description: 'text-gray-500 dark:text-gray-400 text-xs font-medium',
                  actionButton: 'bg-blue-600 text-white font-bold rounded-xl text-xs',
                  cancelButton: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs',
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
