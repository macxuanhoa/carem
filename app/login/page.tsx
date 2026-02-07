'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Car, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
      >
          {/* Header */}
          <div className="bg-blue-600 p-8 text-center">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner">
                <Car className="text-white w-8 h-8" strokeWidth={2.5} />
             </div>
             <h1 className="text-2xl font-bold text-white mb-1">Webxe2</h1>
             <p className="text-blue-100 text-sm font-medium">Đăng nhập hệ thống quản lý</p>
          </div>

          {/* Form */}
          <form action={formAction} className="p-8 pt-6">
            <div className="space-y-5">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Tài khoản</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoFocus
                        placeholder="Nhập tên đăng nhập"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all outline-none font-medium"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Mật khẩu</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all outline-none font-medium"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0" />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Đang đăng nhập...
                  </>
              ) : (
                  "Đăng Nhập"
              )}
            </button>
            
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                    &copy; 2026 Webxe2 System
                </p>
            </div>
          </form>
      </motion.div>
    </div>
  );
}
