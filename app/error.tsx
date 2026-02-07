'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl text-center border border-gray-100 dark:border-gray-700">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 ring-8 ring-red-50/50 dark:ring-red-900/10">
          <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>
        
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Đã có lỗi xảy ra!</h2>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Hệ thống gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.
        </p>

        <div className="flex gap-4 justify-center">
            <button
            onClick={() => window.location.href = '/'}
            className="rounded-xl px-6 py-3 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
            Về trang chủ
            </button>
            <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30"
            >
            <RotateCcw className="h-4 w-4" />
            Thử lại
            </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-950 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
                <p className="font-bold text-red-500 mb-1">Error Details:</p>
                {error.message}
                {error.digest && <p className="mt-1 text-gray-400">Digest: {error.digest}</p>}
            </div>
        )}
      </div>
    </div>
  );
}
