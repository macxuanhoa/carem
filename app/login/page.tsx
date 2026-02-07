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
    <div className="flex min-h-dvh w-full items-center justify-center bg-gray-50 p-4 font-sans relative overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Pattern - Minimal & Technical */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[24px_24px]" />
      </div>

      <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px] relative z-20 flex flex-col items-center justify-center"
      >
          {/* MAIN LOGIN CARD - ERP Style */}
          <div className="bg-white w-full rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center">
            
            {/* Header: Logo & System Name */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4 w-16 h-16">
                     <Image 
                        src="/avtcarem.jpg" 
                        alt="Logo" 
                        fill 
                        className="object-cover rounded-full border border-gray-100 shadow-sm"
                        priority
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight text-center">CỬA HÀNG XE MÁY CÀ REM</h1>
                <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-wider">CHUYÊN MUA BÁN TAY GA CAO CẤP UY TÍN</p>
            </div>

            {/* FORM SECTION */}
            <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tài khoản</label>
                        <div className={`relative transition-all duration-200`}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <User size={18} strokeWidth={2} />
                            </div>
                            <input
                                name="username"
                                type="text"
                                required
                                placeholder="Nhập mã nhân viên / Admin"
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                className={`w-full pl-10 pr-4 py-2.5 rounded-md bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none transition-all ${
                                    focusedInput === 'username' 
                                    ? 'border-blue-600 ring-2 ring-blue-500/10' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu</label>
                        <div className={`relative transition-all duration-200`}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} strokeWidth={2} />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Nhập mật khẩu hệ thống"
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                className={`w-full pl-10 pr-10 py-2.5 rounded-md bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none transition-all ${
                                    focusedInput === 'password' 
                                    ? 'border-blue-600 ring-2 ring-blue-500/10' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                            className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-700 font-medium"
                        >
                            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                            <span>{errorMessage}</span>
                        </m.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-md shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin text-white/80" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <span>Đăng Nhập</span>
                    )}
                </button>
            </form>
            
            {/* Footer - Technical */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-2">
                 <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Phone size={14} />
                    <span>Hotline: 0931.44.00.55</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium text-center max-w-[220px]">
                    <MapPin size={12} className="shrink-0" />
                    <span>107 Nguyễn Tất Thành, Thanh Hà, Hội An</span>
                 </div>
            </div>

          </div>
          
          {/* Bottom Copyright */}
          <div className="text-center mt-6">
             <p className="text-[10px] text-gray-400 font-medium">&copy; 2026 Cà Rem Motor. All rights reserved.</p>
          </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
