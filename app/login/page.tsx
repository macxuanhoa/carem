'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5] px-4 font-sans relative overflow-hidden">
      
      {/* Subtle Background Elements for "Delicate/Gentle" feel */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-[30px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60 p-10 relative z-10"
      >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-28 h-28 relative rounded-full overflow-hidden shadow-xl shadow-blue-500/10 border-4 border-white mb-6 group"
             >
                <Image 
                    src="/avtcarem.jpg" 
                    alt="Webxe2 Logo" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                />
             </motion.div>
             <div className="text-center space-y-1">
                <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Chào mừng trở lại</h1>
                <p className="text-gray-400 text-sm font-medium">Đăng nhập để quản lý hệ thống</p>
             </div>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-6">
            <div className="space-y-5">
              
              <div className="group">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-blue-500 transition-colors duration-300">
                        <User size={20} strokeWidth={2} />
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoFocus
                        placeholder="Tên đăng nhập"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-gray-800 placeholder:text-gray-400 font-medium text-[15px] outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm shadow-gray-100/50"
                    />
                </div>
              </div>

              <div className="group">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-blue-500 transition-colors duration-300">
                        <Lock size={20} strokeWidth={2} />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Mật khẩu"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50/50 border border-gray-100 text-gray-800 placeholder:text-gray-400 font-medium text-[15px] outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm shadow-gray-100/50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer text-[11px] font-bold tracking-wider"
                    >
                        {showPassword ? "ẨN" : "HIỆN"}
                    </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-red-50/80 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium"
              >
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                {errorMessage}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-gray-300 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-[15px] tracking-wide group"
            >
              {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
              ) : (
                  <>
                    Đăng Nhập
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
            
            <div className="pt-4 text-center">
                <p className="text-[11px] text-gray-300 font-bold uppercase tracking-[0.2em]">
                    Webxe2 System &copy; 2026
                </p>
            </div>
          </form>
      </motion.div>
    </div>
  );
}
