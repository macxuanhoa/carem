'use client';

import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, ArrowRight, Sparkles, MapPin, Phone } from 'lucide-react';
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
    <div className="flex min-h-dvh w-full items-center justify-center bg-[#F8F9FB] p-4 font-sans relative overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* PROFESSIONAL BACKGROUND (Subtle & Clean) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Soft Corporate Gradient */}
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-gray-50 via-blue-50/20 to-white" />
          
          {/* Subtle Grid for Structure */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[40px_40px]" />
          
          {/* Ambient Glows (Restrained) */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px]" />
      </div>

      <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-20 flex flex-col items-center justify-center py-8 sm:py-0"
      >
          {/* MAIN CARD - Clean & Sharp */}
          <div className="bg-white w-full rounded-[32px] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)] p-6 sm:p-10 relative overflow-hidden border border-gray-100 flex flex-col justify-center">
            
            {/* Top Brand Stripe */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 to-indigo-600" />

            {/* HEADER SECTION */}
            <div className="flex flex-col items-center mb-8 relative pt-12 md:pt-4">
                <div className="relative mb-6">
                    <div className="w-24 h-24 relative rounded-full overflow-hidden shadow-xl border-4 border-white ring-1 ring-gray-100 bg-white">
                        <Image 
                            src="/avtcarem.jpg" 
                            alt="Logo Webxe2" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
                
                <div className="text-center w-full space-y-4">
                    <div>
                        <h1 className="text-[22px] sm:text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight">HỆ THỐNG QUẢN LÝ</h1>
                    </div>

                    {/* Business Info Box */}
                    <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/60 flex flex-col items-center gap-3 max-w-[300px] mx-auto backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-blue-800 font-extrabold text-[11px] uppercase tracking-wider">
                            <Sparkles size={14} className="text-blue-600 fill-blue-600" />
                            <span>Chuyên Tay Ga Cao Cấp</span>
                        </div>
                        <a href="tel:0914929292" className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-blue-100 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group w-full justify-center">
                             <Phone size={16} className="text-blue-500 fill-blue-100" />
                             <span className="text-gray-900 font-bold text-[15px] tracking-widest">0914.92.92.92</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* FORM SECTION */}
            <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Tài khoản</label>
                        <div className={`group relative transition-all duration-200 ${focusedInput === 'username' ? 'ring-2 ring-blue-100 rounded-xl' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedInput === 'username' ? 'text-blue-600' : 'text-gray-400'}`}>
                                <User size={18} />
                            </div>
                            <input
                                name="username"
                                type="text"
                                required
                                placeholder="Nhập tên đăng nhập"
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Mật khẩu</label>
                        <div className={`group relative transition-all duration-200 ${focusedInput === 'password' ? 'ring-2 ring-blue-100 rounded-xl' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusedInput === 'password' ? 'text-blue-600' : 'text-gray-400'}`}>
                                <Lock size={18} />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Nhập mật khẩu"
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            >
                                <span className="text-[10px] font-bold text-gray-400 hover:text-blue-600 cursor-pointer uppercase tracking-wider p-1">
                                    {showPassword ? "Ẩn" : "Hiện"}
                                </span>
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
                            className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium"
                        >
                            <AlertCircle size={16} className="shrink-0 text-red-500" />
                            {errorMessage}
                        </m.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <Loader2 size={20} className="animate-spin text-white/80" />
                    ) : (
                        <>
                            <span>Đăng Nhập</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
                
                {/* FOOTER ADDRESS - Clean & Legible */}
                <div className="pt-8 mt-4 border-t border-gray-100/80">
                     <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                            <MapPin size={11} />
                            Địa Chỉ
                        </div>
                        <p className="text-[13px] font-medium text-gray-600 text-center leading-relaxed max-w-[280px] mx-auto">
                            107 Nguyễn Tất Thành, Thanh Hà, Hội An
                        </p>
                     </div>
                </div>
            </form>
          </div>
          
          {/* Bottom Copyright */}
          <div className="text-center mt-6">
             <p className="text-[11px] text-gray-400 font-medium">&copy; 2026 Webxe2 System. All rights reserved.</p>
          </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
