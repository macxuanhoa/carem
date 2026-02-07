'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Car, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-black p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-lg mb-4 ring-1 ring-white/30">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Quản Lý Xe</h1>
              <p className="mt-2 text-blue-100 font-medium text-sm uppercase tracking-wider">Hệ thống quản trị nội bộ</p>
            </div>
          </div>
          
          {/* Form */}
          <form action={formAction} className="p-8 pt-10">
            <div className="mb-6 space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1"
              >
                Mật khẩu truy cập
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full group relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 p-px focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
            >
              <div className="relative bg-transparent h-full w-full rounded-[11px] px-4 py-3.5 flex items-center justify-center gap-2 text-white font-bold text-lg transition-all group-hover:bg-white/10">
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Nhập</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
            
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 text-sm text-red-600 dark:text-red-400 text-center font-medium flex items-center justify-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {errorMessage}
              </motion.div>
            )}
            
            <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Webxe2 Management System
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
