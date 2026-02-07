'use client';

import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Phone, MapPin } from 'lucide-react';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Prevent scroll bounce on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex min-h-dvh w-full items-start md:items-center justify-center bg-[#f8fafc] p-2 pt-4 md:p-4 font-sans relative overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Pattern - Modern Grid with Vignette */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-blue-50/50 to-transparent" />
      </div>

      <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-20 flex flex-col items-center justify-center"
      >
          {/* MAIN LOGIN CARD */}
          <div className="bg-white/80 backdrop-blur-xl w-full rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-5 sm:p-10 relative overflow-hidden flex flex-col justify-center ring-1 ring-gray-900/5">
            
            {/* Header: Logo & System Name */}
            <div className="flex flex-col items-center mb-4 sm:mb-8">
                <m.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative mb-3 sm:mb-5 w-20 h-20 sm:w-24 sm:h-24"
                >
                     <Image 
                        src="/avtcarem.jpg" 
                        alt="Logo" 
                        fill 
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover rounded-full border-4 border-white shadow-lg"
                        priority
                        quality={90}
                    />
                </m.div>
                <h1 className="text-xl font-black text-blue-950 uppercase tracking-tight text-center leading-snug max-w-[300px]">
                    CỬA HÀNG XE MÁY <br className="hidden sm:block" /> <span className="text-blue-600">CÀ REM</span>
                </h1>
                <div className="mt-3 flex flex-col items-center gap-1">
                    <span className="bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-blue-100 shadow-sm">
                        Chuyên Tay Ga Cao Cấp
                    </span>
                </div>
            </div>

            {/* FORM SECTION */}
            <form action={formAction} className="space-y-4 sm:space-y-5">
                <div className="space-y-3 sm:space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-[13px] font-bold text-blue-900 mb-2 uppercase tracking-wide ml-1">Tài khoản</label>
                        <div className={`relative group transition-all duration-300 ${focusedInput === 'username' ? 'scale-[1.01]' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${focusedInput === 'username' ? 'text-blue-600' : 'text-slate-400'}`}>
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <input
                                name="username"
                                type="text"
                                required
                                placeholder="Nhập tài khoản"
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border transition-all duration-300 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none ${
                                    focusedInput === 'username' 
                                    ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[13px] font-bold text-blue-900 mb-2 uppercase tracking-wide ml-1">Mật khẩu</label>
                        <div className={`relative group transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.01]' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${focusedInput === 'password' ? 'text-blue-600' : 'text-slate-400'}`}>
                                <Lock size={18} strokeWidth={2.5} />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                className={`w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border transition-all duration-300 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none ${
                                    focusedInput === 'password' 
                                    ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {errorMessage && (
                        <m.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-sm text-red-700 font-medium shadow-sm"
                        >
                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                            <span>{errorMessage}</span>
                        </m.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 sm:mt-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2.5 sm:py-3 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wider group"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={20} className="animate-spin text-white/90" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <span>Đăng Nhập</span>
                            <m.div 
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                            >
                                <ShieldCheck size={18} className="text-white/80 group-hover:text-white transition-colors" />
                            </m.div>
                        </>
                    )}
                </button>
            </form>
            
            {/* Footer - Technical */}
            <div className="mt-5 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-100 w-full">
                 <div className="flex flex-col gap-2.5 sm:gap-3">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium bg-blue-50/50 px-4 py-2.5 rounded-xl border border-blue-100 text-blue-700">
                        <Phone size={16} className="text-blue-600" />
                        <span>Hotline: <span className="font-bold">0914.92.92.92</span></span>
                    </div>
                    
                    <div className="flex items-start justify-center gap-1.5 text-xs text-slate-500 font-medium px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
                        <MapPin size={14} className="shrink-0 text-red-500 mt-0.5" />
                        <span className="text-center leading-relaxed">
                            <span className="font-bold text-blue-900">Cửa hàng xe máy Cà Rem</span>
                            <br />
                            107 Nguyễn Tất Thành, Thanh Hà, Hội An
                        </span>
                    </div>
                 </div>
            </div>

          </div>
          
          {/* Bottom Copyright */}
          <div className="text-center mt-4 sm:mt-8">
             <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium flex items-center gap-1.5 justify-center">
                <span>&copy; 2026 Cà Rem.</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>All rights reserved.</span>
             </p>
          </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
