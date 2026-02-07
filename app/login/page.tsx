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
    <div className="flex h-[100dvh] w-full items-center justify-center bg-white px-4 font-sans relative overflow-hidden overscroll-none touch-none selection:bg-blue-100">
      
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
          {/* Abstract Mesh Gradients */}
          <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-50/20 to-transparent blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100/40 via-blue-50/20 to-transparent blur-[120px] animate-pulse-slow delay-1000" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
          {/* Main Card */}
          <div className="bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.8)] p-8 sm:p-10 border border-white/50">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-70" />
                    <div className="w-24 h-24 relative rounded-full overflow-hidden shadow-2xl border-[4px] border-white">
                        <Image 
                            src="/avtcarem.jpg" 
                            alt="Logo" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg">
                        <Sparkles size={12} fill="currentColor" />
                    </div>
                </motion.div>
                
                <div className="mt-6 text-center space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Xin Chào</h1>
                    <p className="text-gray-500 text-sm font-medium">Đăng nhập hệ thống Webxe2</p>
                </div>
            </div>

            {/* Form */}
            <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    {/* Username */}
                    <div className="group relative transition-all duration-300 focus-within:scale-[1.02]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <User size={20} strokeWidth={2} />
                        </div>
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="Tài khoản"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/50 border border-gray-100 text-gray-900 placeholder:text-gray-400 font-medium outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="group relative transition-all duration-300 focus-within:scale-[1.02]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                            <Lock size={20} strokeWidth={2} />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Mật khẩu"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/50 border border-gray-100 text-gray-900 placeholder:text-gray-400 font-medium outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors cursor-pointer tracking-wider"
                        >
                            {showPassword ? "ẨN" : "HIỆN"}
                        </button>
                    </div>
                </div>

                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 rounded-2xl bg-red-50/80 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium"
                    >
                        <div className="p-1 bg-red-100 rounded-full">
                            <AlertCircle size={14} className="text-red-600" />
                        </div>
                        {errorMessage}
                    </motion.div>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group"
                >
                    {isPending ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            Đăng Nhập
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
                        </>
                    )}
                </button>
                
                <div className="pt-6 text-center">
                     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                        Webxe2 System
                     </p>
                </div>
            </form>
          </div>
      </motion.div>
    </div>
  );
}
