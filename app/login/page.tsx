'use client';

import { useActionState, useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-4 font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8"
      >
          {/* Header */}
          <div className="text-center mb-8 pt-4">
             <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden shadow-sm border border-gray-50">
                <Image 
                    src="/avtcarem.jpg" 
                    alt="Logo" 
                    fill 
                    className="object-cover"
                    priority
                />
             </div>
             <h1 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Chào mừng trở lại</h1>
             <p className="text-gray-400 text-sm font-medium">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {/* Form */}
          <form action={formAction}>
            <div className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tài khoản</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-blue-500 transition-colors">
                        <User size={18} strokeWidth={2.5} />
                    </div>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoFocus
                        placeholder="Nhập tên đăng nhập"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-sm"
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-300 group-focus-within:text-blue-500 transition-colors">
                        <Lock size={18} strokeWidth={2.5} />
                    </div>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-xs font-bold"
                    >
                        {showPassword ? "ẨN" : "HIỆN"}
                    </button>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm tracking-wide"
            >
              {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Đang xử lý...
                  </>
              ) : (
                  "Đăng Nhập"
              )}
            </button>
            
            <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    Webxe2 System &copy; 2026
                </p>
            </div>
          </form>
      </motion.div>
    </div>
  );
}
