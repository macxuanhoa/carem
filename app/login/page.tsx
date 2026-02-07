'use client';

import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Car, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Chào buổi sáng!');
    else if (hour >= 12 && hour < 18) setGreeting('Chào buổi chiều!');
    else setGreeting('Chào buổi tối!');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 relative overflow-hidden p-4 font-sans">
      {/* Dynamic Background with Car Theme */}
      <div className="absolute inset-0 z-0">
          {/* Abstract Car Silhouette or high quality gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-[#0f172a] to-[#1e1b4b]" />
          
          {/* Decorative Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-4xl shadow-2xl border border-white/10 overflow-hidden ring-1 ring-white/5">
          
          {/* Header Section */}
          <div className="pt-10 pb-2 px-8 text-center relative">
             <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/40 mb-6 group transform hover:scale-105 transition-transform duration-300"
             >
                <Car className="w-10 h-10 text-white drop-shadow-md" />
             </motion.div>
             
             <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2 tracking-tight"
             >
                {greeting || 'Xin chào!'}
             </motion.h1>
             
             <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-blue-200/80 text-sm font-medium"
             >
                Hệ thống Quản lý Xe Chuyên nghiệp
             </motion.p>
          </div>
          
          {/* Form Section */}
          <form action={formAction} className="p-8 pt-6">
            <div className="mb-8 space-y-6">
              <div className="relative group">
                <label className="block text-xs font-bold text-blue-300 uppercase tracking-wider mb-2 ml-1">Mật khẩu truy cập</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-200/50 group-focus-within:text-blue-400 transition-colors">
                        <KeyRound className="h-5 w-5" />
                    </div>
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu admin..."
                    className="w-full pl-11 pr-12 py-4 rounded-xl border border-white/10 bg-black/20 text-white placeholder-blue-200/20 focus:border-blue-500/50 focus:bg-black/40 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none backdrop-blur-sm"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-200/40 hover:text-white transition-colors cursor-pointer"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full group relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-600 p-px focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-[background-position,transform,box-shadow] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-900/20 bg-size-[200%_auto] hover:bg-right duration-500"
            >
              <div className="relative bg-transparent h-full w-full rounded-[11px] px-4 py-4 flex items-center justify-center gap-2 text-white font-bold text-lg">
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Nhập Ngay</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
            
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200 text-center font-medium flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <div className="p-1.5 bg-red-500/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-red-400" />
                </div>
                {errorMessage}
              </motion.div>
            )}
            
            <div className="mt-8 flex flex-col items-center justify-center gap-2">
                <div className="h-px w-16 bg-white/10"></div>
                <p className="text-[10px] text-blue-200/30 font-medium uppercase tracking-widest">
                  Webxe2 &copy; 2026
                </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
