'use client';

import { useActionState, useState, useEffect } from 'react';
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

  // Prevent scroll bounce on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#FDFDFD] px-4 font-sans relative overflow-hidden overscroll-none touch-none">
      
      {/* Sophisticated Background - Gentle Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-50/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/40 rounded-full blur-[100px]" />
          {/* Subtle Grain Texture for texture/refinement */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Apple-style easing
        className="w-full max-w-[420px] bg-white/60 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02),0_0_0_1px_rgba(255,255,255,0.8)] p-8 sm:p-10 relative z-10 mx-auto"
      >
          {/* Logo Section - Floating effect */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
             <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border-[3px] border-white mb-4 sm:mb-6"
             >
                <Image 
                    src="/avtcarem.jpg" 
                    alt="Webxe2 Logo" 
                    fill 
                    className="object-cover"
                    priority
                />
             </motion.div>
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
             >
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-1.5 font-display">Chào mừng trở lại</h1>
                <p className="text-gray-400 text-[11px] sm:text-[13px] font-medium tracking-wide uppercase">Hệ thống quản lý xe chuyên nghiệp</p>
             </motion.div>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                    <User size={18} />
                </div>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoFocus
                    placeholder="Tên đăng nhập"
                    className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/50 border border-gray-100 text-gray-800 placeholder:text-gray-400 text-[14px] sm:text-[15px] font-medium outline-none focus:bg-white focus:border-blue-100 focus:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.1)] transition-all duration-300"
                />
              </div>

              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                    <Lock size={18} />
                </div>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Mật khẩu"
                    className="w-full pl-11 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white/50 border border-gray-100 text-gray-800 placeholder:text-gray-400 text-[14px] sm:text-[15px] font-medium outline-none focus:bg-white focus:border-blue-100 focus:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.1)] transition-all duration-300"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-[10px] font-bold tracking-wider"
                >
                    {showPassword ? "ẨN" : "HIỆN"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 rounded-xl bg-red-50/50 border border-red-100/50 flex items-center gap-3 text-[13px] text-red-600 font-medium"
              >
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                {errorMessage}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-3.5 sm:py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-[14px] sm:text-[15px] tracking-wide group"
            >
              {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    <span className="text-gray-300">Đang xác thực...</span>
                  </>
              ) : (
                  <>
                    Đăng Nhập
                    <ArrowRight size={18} className="ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
              )}
            </button>
            
            <div className="pt-6 text-center">
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] hover:text-gray-400 transition-colors cursor-default">
                    Webxe2 System &copy; 2026
                </p>
            </div>
          </form>
      </motion.div>
    </div>
  );
}
