'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Lỗi tải chi phí</h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Không thể tải danh sách chi phí. Vui lòng kiểm tra kết nối mạng.
        </p>

        <Button onClick={() => reset()} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Thử lại
        </Button>
      </div>
    </div>
  );
}
