'use client';

import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#F8FAFC] px-4 font-sans relative overflow-hidden overscroll-none touch-none selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Artistic Background - Living Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [0, 50, 0],
                y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply" 
          />
          <motion.div 
            animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, -60, 0],
                x: [0, -30, 0],
                y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply" 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.6)] p-8 sm:p-10 relative overflow-hidden group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-500">
            
            {/* Top Highlight Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 rounded-b-full" />

            {/* Logo & Header */}
            <div className="flex flex-col items-center mb-10">
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-lg opacity-80" />
                    <div className="w-24 h-24 relative rounded-full overflow-hidden shadow-xl border-4 border-white z-10">
                        <Image 
                            src="/avtcarem.jpg" 
                            alt="Logo" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                </motion.div>
                
                <div className="mt-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">Xin chào bạn!</h1>
                    <p className="text-gray-500 text-sm font-medium px-4">Hãy đăng nhập để bắt đầu ngày làm việc hiệu quả</p>
                </div>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    {/* Username Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="Tên đăng nhập"
                            className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50/50 border border-transparent hover:bg-gray-50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 text-gray-900 placeholder:text-gray-400 font-medium outline-none transition-all duration-300"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="group relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Mật khẩu"
                            className="w-full pl-12 pr-14 py-4 rounded-2xl bg-gray-50/50 border border-transparent hover:bg-gray-50 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 text-gray-900 placeholder:text-gray-400 font-medium outline-none transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-[10px] font-bold text-gray-400 hover:text-blue-600 transition-colors cursor-pointer tracking-widest uppercase"
                        >
                            {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="px-4 py-3 rounded-2xl bg-red-50/80 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {errorMessage}
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-gray-300 hover:scale-[1.02] transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group"
                >
                    {isPending ? (
                        <Loader2 size={20} className="animate-spin text-gray-400" />
                    ) : (
                        <>
                            <span className="mr-2">Đăng Nhập</span>
                            <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </>
                    )}
                </button>
                
                <div className="pt-8 text-center opacity-60 hover:opacity-100 transition-opacity">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                        Webxe2 System
                     </p>
                </div>
            </form>
          </div>
      </motion.div>
    </div>
  );
}
