import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FileQuestion className="h-12 w-12 text-gray-400" />
        </div>
        
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Không tìm thấy trang</h2>
        <p className="mb-8 max-w-md text-gray-500 dark:text-gray-400 mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/30"
        >
          <Home className="h-4 w-4" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
