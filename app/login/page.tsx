'use client';

import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, ArrowRight, Sparkles, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#F0F4F8] px-4 font-sans relative overflow-hidden overscroll-none touch-none selection:bg-blue-200 selection:text-blue-900">
      
      {/* VIBRANT & SMOOTH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Main Gradient Mesh */}
          <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)] z-10 mix-blend-overlay pointer-events-none" />
          
          <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 45, 0],
                x: [0, 20, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-400/30 to-cyan-300/30 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -30, 0],
                x: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-10%] left-[-20%] w-[700px] h-[700px] bg-gradient-to-tr from-purple-400/30 to-indigo-400/30 rounded-full blur-[120px]" 
          />
          
          {/* Subtle Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-soft-light" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-[400px] relative z-20"
      >
          {/* GLASS CARD CONTAINER */}
          <div className="bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_100px_-20px_rgba(50,50,93,0.15),0_20px_60px_-30px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.6)] p-8 sm:p-10 relative overflow-hidden">
            
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

            {/* HEADER SECTION */}
            <div className="flex flex-col items-center mb-8 relative">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative cursor-pointer group"
                >
                    {/* Glowing Aura */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="w-28 h-28 relative rounded-full overflow-hidden shadow-2xl border-[4px] border-white z-10 bg-white ring-1 ring-black/5">
                        <Image 
                            src="/avtcarem.jpg" 
                            alt="Logo" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Status Indicator */}
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white z-20 shadow-sm animate-pulse" />
                </motion.div>
                
                <div className="mt-6 text-center w-full">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-3 tracking-tight">Xin chào bạn!</h1>
                    
                    {/* Badge Info */}
                    <div className="inline-flex flex-col items-center gap-2 bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50 w-full">
                        <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px] uppercase tracking-wider">
                            <Sparkles size={12} className="text-blue-500 fill-blue-500" />
                            Chuyên Mua Bán Tay Ga Cao Cấp
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100">
                             <Phone size={12} className="text-gray-400" />
                             <span className="text-gray-800 font-bold text-sm tracking-wide">0914.92.92.92</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FORM SECTION */}
            <form action={formAction} className="space-y-5">
                <div className="space-y-4">
                    {/* Username */}
                    <motion.div 
                        animate={focusedInput === 'username' ? { y: -2 } : { y: 0 }}
                        className={`group relative transition-all duration-300 ${focusedInput === 'username' ? 'shadow-lg shadow-blue-500/10 rounded-2xl' : ''}`}
                    >
                        <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${focusedInput === 'username' ? 'text-blue-600' : 'text-gray-400'}`}>
                            <User size={20} />
                        </div>
                        <input
                            name="username"
                            type="text"
                            required
                            placeholder="Tên đăng nhập"
                            onFocus={() => setFocusedInput('username')}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-5 py-4.5 rounded-2xl bg-white/60 border border-gray-100 hover:bg-white hover:border-blue-200 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-gray-900 placeholder:text-gray-400 font-medium outline-none transition-all duration-300"
                        />
                    </motion.div>

                    {/* Password */}
                    <motion.div 
                        animate={focusedInput === 'password' ? { y: -2 } : { y: 0 }}
                        className={`group relative transition-all duration-300 ${focusedInput === 'password' ? 'shadow-lg shadow-blue-500/10 rounded-2xl' : ''}`}
                    >
                        <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 ${focusedInput === 'password' ? 'text-blue-600' : 'text-gray-400'}`}>
                            <Lock size={20} />
                        </div>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Mật khẩu"
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                            className="w-full pl-12 pr-14 py-4.5 rounded-2xl bg-white/60 border border-gray-100 hover:bg-white hover:border-blue-200 focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-gray-900 placeholder:text-gray-400 font-medium outline-none transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-5 flex items-center"
                        >
                            <span className="text-[10px] font-bold text-gray-400 hover:text-blue-600 bg-gray-100/50 hover:bg-blue-50 px-2 py-1 rounded-md transition-all cursor-pointer uppercase tracking-wider">
                                {showPassword ? "Ẩn" : "Hiện"}
                            </span>
                        </button>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {errorMessage && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="px-4 py-3 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-sm text-red-600 font-medium shadow-sm"
                        >
                            <AlertCircle size={18} className="shrink-0 text-red-500 fill-red-100" />
                            {errorMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-4.5 rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center group relative overflow-hidden"
                >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                    
                    {isPending ? (
                        <Loader2 size={22} className="animate-spin text-gray-400 relative z-10" />
                    ) : (
                        <div className="flex items-center gap-3 relative z-10">
                            <span className="text-[15px] tracking-wide">Đăng Nhập Ngay</span>
                            <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    )}
                </button>
                
                {/* FOOTER ADDRESS */}
                <div className="pt-8 mt-2 border-t border-gray-100/50">
                     <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 group cursor-default">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-full">
                            <MapPin size={10} />
                            Địa Chỉ Showroom
                        </div>
                        <p className="text-[12px] font-medium text-gray-500 text-center max-w-[250px] leading-relaxed group-hover:text-gray-800 transition-colors">
                            107 Nguyễn Tất Thành, Thanh Hà, Hội An
                        </p>
                     </div>
                </div>
            </form>
          </div>
          
          {/* Bottom Copyright */}
          <div className="text-center mt-6">
             <p className="text-[10px] text-gray-400 font-medium">Webxe2 System &copy; 2026</p>
          </div>
      </motion.div>
    </div>
  );
}
