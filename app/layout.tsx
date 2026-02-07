import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import Providers from "./providers";
import Link from 'next/link';

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
        <div className="mx-auto max-w-7xl min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            {/* Desktop Header - Only visible on md+ screens */}
            <header className="hidden md:flex bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 shadow-sm p-4 justify-between items-center sticky top-0 z-50 transition-colors duration-200">
                <div className="font-bold text-xl text-blue-600 dark:text-blue-500">AUTO MANAGER</div>
                <div className="flex items-center gap-6">
                    <nav className="space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</Link>
                        <Link href="/cars" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Xe</Link>
                        <Link href="/expenses" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Chi Phí</Link>
                        <Link href="/reports" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Báo Cáo</Link>
                    </nav>
                    <div className="pl-6 border-l border-gray-200 dark:border-gray-700">
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
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
        </div>
        </Providers>
      </body>
    </html>
  );
}
