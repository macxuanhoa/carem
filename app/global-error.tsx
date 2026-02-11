'use client';

import { Metadata, Viewport } from 'next';
// import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console or Sentry
    console.error('Global Error:', error);
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
            <div className="bg-rose-500/10 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center border border-rose-500/20">
                <AlertTriangle size={48} className="text-rose-500" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Hệ thống gặp sự cố</h2>
                <p className="text-slate-400 text-sm">
                    Đã xảy ra lỗi nghiêm trọng. Chúng tôi đã ghi nhận sự cố này.
                </p>
                {error.digest && (
                    <p className="text-xs font-mono bg-slate-900 p-2 rounded text-slate-500">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>

            <Button 
                onClick={() => reset()}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 rounded-xl"
            >
                <RefreshCcw className="mr-2 h-4 w-4" /> Thử lại
            </Button>
        </div>
      </body>
    </html>
  );
}
