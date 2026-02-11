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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl text-center border border-slate-800">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 ring-8 ring-rose-500/5">
          <AlertTriangle className="h-10 w-10 text-rose-500" />
        </div>
        
        <h2 className="mb-2 text-2xl font-bold text-white">Đã có lỗi xảy ra!</h2>
        <p className="mb-8 text-slate-400">
          Hệ thống gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.
        </p>

        <div className="flex gap-4 justify-center">
            <button
            onClick={() => window.location.href = '/'}
            className="rounded-xl px-6 py-3 font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
            Về trang chủ
            </button>
            <button
            onClick={() => reset()}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition-all hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-500/30"
            >
            <RotateCcw className="h-4 w-4" />
            Thử lại
            </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-slate-950 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-rose-300 border border-rose-900/20">
                <p className="font-bold text-rose-500 mb-1">Error Details:</p>
                {error.message}
                {error.digest && <p className="mt-1 text-slate-500">Digest: {error.digest}</p>}
            </div>
        )}
      </div>
    </div>
  );
}
